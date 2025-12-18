from django.http import JsonResponse
from django.db import connections
from django.db.utils import DatabaseError
from django.views.decorators.http import require_POST, require_GET
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from django.db import transaction
import json
from feedback_app.serializers import LoginSerializer, FeedbackSerializer
from feedback_app.models.feedback_response import Feedback_Response
from feedback_app.models.feedback_submissionlog import Feedback_SubmissionLog
from feedback_app.models.academic_allocation import Academic_Allocation
from feedback_app.models.users_student import Users_Student
from functools import wraps

def login_required_api(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.session.get("is_authenticated"):
            return JsonResponse({"status": "error", "error": "not authenticated please login"}, status=401)
        return view_func(request, *args, **kwargs)
    return wrapper

# login api 
@csrf_exempt
@require_POST
def login(request):
    
    # robust body parsing
    content_type = request.META.get('CONTENT_TYPE', '') or request.META.get('HTTP_CONTENT_TYPE', '')
    raw_body = request.body or b''
    payload = {}

    if raw_body:
        try:
            s = raw_body.decode('utf-8').strip()
        except Exception:
            s = ''
        try_json = False
        if 'application/json' in content_type:
            try_json = True
        else:
            # if body looks like JSON even without proper header, attempt parse
            if s.startswith('{') or s.startswith('['):
                try_json = True

        if try_json:
            try:
                payload = json.loads(s or '{}')
            except Exception:
                return JsonResponse({'status': 'error', 'error': 'invalid JSON'}, status=400)
        else:
            # form / urlencoded / multipart parse via Django request.POST
            payload = request.POST.dict()
    else:
        # No body: accept form-urlencoded (if client used GET) or query params
        payload = request.POST.dict() or request.GET.dict()

    # normalize keys from various client names
    email_raw = payload.get('email') or payload.get('Email') or payload.get('username') or payload.get('user')
    dob_raw = payload.get('dob') or payload.get('DateOfBirth') or payload.get('date_of_birth') or payload.get('dob_date')

    # validate inputs via serializer (Django Form)
    serializer = LoginSerializer(data={'email': email_raw, 'dob': dob_raw})
    if not serializer.is_valid():
        errors = serializer.errors  # dict-like: field -> list/ErrorList
        req_msg = getattr(LoginSerializer, "REQUIRED_MSG", None)
        if req_msg:
            # detect exact required-message in any field errors
            found_req = False
            for vals in errors.values():
                # vals may be ErrorList or list
                for v in (vals if isinstance(vals, (list, tuple)) else [vals]):
                    # v may be a ValidationError, ErrorList item, or string - coerce to str
                    if str(v) == req_msg:
                        found_req = True
                        break
                if found_req:
                    break
            if found_req:
                return JsonResponse({'status': 'error', 'error': req_msg}, status=400)

        return JsonResponse({'status': 'error', 'errors': errors}, status=400)

    email = serializer.cleaned_data.get('email')
    dob = serializer.cleaned_data.get('dob')  # datetime.date

    try:
        user = Users_Student.objects.get(Email__iexact=email)
    except Users_Student.DoesNotExist:
        return JsonResponse({'status': 'error', 'error': 'invalid credentials'}, status=401)

    try:
        user.full_clean()
    except ValidationError as ve:
        return JsonResponse({'status': 'error', 'error': 'user data invalid', 'details': ve.message_dict}, status=400)

    if hasattr(user, 'IsActive') and not user.IsActive:
        return JsonResponse({'status': 'error', 'error': 'account inactive'}, status=403)

    user_dob = user.DateOfBirth
    if user_dob and user_dob == dob:
        request.session['user_enrollment'] = user.EnrollmentNo
        request.session['user_email'] = user.Email
        request.session['user_fullname'] = user.FullName
        request.session['is_authenticated'] = True
        request.session.set_expiry(24 * 3600)
        request.session.save()
        request.session.modified = True
        return JsonResponse({
            'status': 'ok',
            'message': 'login successful',
            'EnrollmentNo': user.EnrollmentNo,
            'FullName': user.FullName,
            'Email': user.Email,
            'session_key': request.session.session_key,
        })

    return JsonResponse({'status': 'error', 'error': 'invalid credentials'}, status=401)

# logout api

@csrf_exempt
@require_POST
def logout(request):
    # Clear session data
    request.session.flush()

    # Remove cookie from client
    response = JsonResponse({"status": "ok", "message": "logged out successfully"})
    response.delete_cookie('sessionid')

    return response



@require_GET
@login_required_api
def my_teachers(request):
    """
    Return subjects and their assigned teachers for the logged-in student.
    Matches student Branch, Year, Section, and Semester with Academic_Allocation.
    """

    enrollment = request.session.get("user_enrollment")
    if not enrollment:
        return JsonResponse({"status": "error", "error": "not authenticated"}, status=401)

    try:
        student = Users_Student.objects.get(EnrollmentNo=enrollment)
    except Users_Student.DoesNotExist:
        return JsonResponse({"status": "error", "error": "student not found"}, status=404)

    branch = student.Branch
    year = student.Year
    semester = student.Semester
    section = student.Section

    if not branch or not year or not semester or not section:
        return JsonResponse({"status": "error", "error": "student data incomplete"}, status=400)

    qs = Academic_Allocation.objects.select_related("TeacherID", "SubjectCode") \
        .filter(
            TargetBranch__iexact=branch,
            Target_Year=year,
            Target_Section=section,
            Target_Semester=semester,
            SubjectCode__Semester=semester,          # subject's Semester matches student
            SubjectCode__Branch__iexact=branch       # subject's Branch matches student
        ) \
    .order_by("SubjectCode__SubjectCode")

    # Get all submitted allocations for this student to show status
    submitted_allocations = set(
        Feedback_SubmissionLog.objects.filter(EnrollmentNo=enrollment)
        .values_list("AllocationID", flat=True)
    )

    subjects_map = {}

    for alloc in qs:
        subj = alloc.SubjectCode
        teacher = alloc.TeacherID

        if not subj or not teacher:
            continue

        key = subj.SubjectCode

        if key not in subjects_map:
            subjects_map[key] = {
                "subject_code": subj.SubjectCode,
                "subject_name": subj.SubjectName,
                "semester": subj.Semester,
                "branch": subj.Branch,
                "teachers": []
            }

        subjects_map[key]["teachers"].append({
            "allocation_id": alloc.AllocationID,
            "teacher_id": teacher.TeacherID,
            "teacher_name": teacher.FullName,
            "designation": teacher.Designation,
            "is_submitted": alloc.AllocationID in submitted_allocations
        })

    return JsonResponse({
        "status": "ok",
        "enrollment": enrollment,
        "branch": branch,
        "year": year,
        "semester": semester,
        "section": section,
        "subjects": list(subjects_map.values())
    })



@csrf_exempt
@require_POST
@login_required_api
def submit_feedback(request):
    """
    Student submits feedback using allocation_id + subject_code.
    Backend verifies allocation matches student class + subject.
    Supports JSON, form-data, form-urlencoded.
    """

    # -------------------------------------
    # 1. Parse Input (JSON OR FORM)
    # -------------------------------------
    raw_body = request.body or b""
    payload = {}

    content_type = request.META.get("CONTENT_TYPE", "")
    is_json = "application/json" in content_type

    if raw_body:
        text = raw_body.decode("utf-8").strip()

        if is_json or text.startswith("{"):  # JSON input
            try:
                payload = json.loads(text)
            except Exception:
                return JsonResponse({"status": "error", "error": "invalid JSON"}, status=400)
        else:
            payload = request.POST.dict()
    else:
        payload = request.POST.dict() or request.GET.dict()

    # -------------------------------------
    # 2. Validate With Serializer
    # -------------------------------------
    form = FeedbackSerializer(data=payload)
    if not form.is_valid():
        return JsonResponse({"status": "error", "errors": form.errors}, status=400)

    allocation_id = form.cleaned_data.get("allocation_id")
    subject_code = form.cleaned_data.get("subject_code")
    comments = form.cleaned_data.get("comments")

    ratings = {f"q{i}": form.cleaned_data.get(f"q{i}") for i in range(1, 11)}

    # -------------------------------------
    # 3. Get Student
    # -------------------------------------
    enrollment_no = request.session.get("user_enrollment")
    if not enrollment_no:
        return JsonResponse({"status": "error", "error": "not authenticated"}, status=401)

    try:
        student = Users_Student.objects.get(EnrollmentNo=enrollment_no)
    except Users_Student.DoesNotExist:
        return JsonResponse({"status": "error", "error": "student not found"}, status=404)

    # -------------------------------------
    # 4. Lookup Allocation
    # -------------------------------------
    try:
        alloc = Academic_Allocation.objects.select_related("TeacherID", "SubjectCode").get(
            AllocationID=allocation_id
        )
    except Academic_Allocation.DoesNotExist:
        return JsonResponse({
            "status": "error",
            "error": "Invalid allocation_id"
        }, status=404)

    # -------------------------------------
    # 5. Subject must match allocation
    # -------------------------------------
    if alloc.SubjectCode.SubjectCode != subject_code:
        return JsonResponse({
            "status": "error",
            "error": "subject mismatch for allocation_id"
        }, status=403)

    # -------------------------------------
    # 6. Allocation must belong to student's class
    # -------------------------------------
    if (
        alloc.TargetBranch.lower() != student.Branch.lower()
        or alloc.Target_Year != student.Year
        or alloc.Target_Section != student.Section
        or alloc.Target_Semester != student.Semester
    ):
        return JsonResponse({
            "status": "error",
            "error": "allocation_id does not belong to logged-in student"
        }, status=403)

    # -------------------------------------
    # 7. Check duplicate feedback
    # -------------------------------------
    if Feedback_SubmissionLog.objects.filter(
        EnrollmentNo=student, AllocationID=alloc
    ).exists():
        return JsonResponse({
            "status": "error",
            "error": "feedback already submitted"
        }, status=409)

    # -------------------------------------
    # 8. Save feedback atomically
    # -------------------------------------
    try:
        with transaction.atomic():

            feedback = Feedback_Response(
                AllocationID=alloc,
                Q1_Rating=ratings["q1"],
                Q2_Rating=ratings["q2"],
                Q3_Rating=ratings["q3"],
                Q4_Rating=ratings["q4"],
                Q5_Rating=ratings["q5"],
                Q6_Rating=ratings["q6"],
                Q7_Rating=ratings["q7"],
                Q8_Rating=ratings["q8"],
                Q9_Rating=ratings["q9"],
                Q10_Rating=ratings["q10"],
                Comments=comments or None
            )
            feedback.full_clean()
            feedback.save()

            Feedback_SubmissionLog.objects.create(
                ResponseID=feedback,
                EnrollmentNo=student,
                AllocationID=alloc
            )

    except Exception as e:
        return JsonResponse({
            "status": "error",
            "error": "failed to save feedback",
            "details": str(e)
        }, status=500)

    return JsonResponse({
        "status": "ok",
        "message": "feedback submitted",
        "allocation_id": alloc.AllocationID
    })


@require_GET
@login_required_api
def my_feedbacks(request):
    """
    Return a list of feedbacks submitted by the logged-in student.
    Includes teacher and subject details along with ratings.
    """
    enrollment = request.session.get("user_enrollment")
    
    # Filter logs for this student
    logs = Feedback_SubmissionLog.objects.filter(EnrollmentNo=enrollment).select_related(
        "ResponseID", 
        "AllocationID__TeacherID", 
        "AllocationID__SubjectCode"
    ).order_by("-Timestamp")

    results = []
    for log in logs:
        resp = log.ResponseID
        alloc = log.AllocationID
        teacher = alloc.TeacherID
        subject = alloc.SubjectCode

        results.append({
            "log_id": log.LogID,
            "timestamp": log.Timestamp,
            "teacher_name": teacher.FullName,
            "subject_name": subject.SubjectName,
            "subject_code": subject.SubjectCode,
            "ratings": {
                "q1": resp.Q1_Rating,
                "q2": resp.Q2_Rating,
                "q3": resp.Q3_Rating,
                "q4": resp.Q4_Rating,
                "q5": resp.Q5_Rating,
                "q6": resp.Q6_Rating,
                "q7": resp.Q7_Rating,
                "q8": resp.Q8_Rating,
                "q9": resp.Q9_Rating,
                "q10": resp.Q10_Rating,
            },
            "comments": resp.Comments
        })

    return JsonResponse({
        "status": "ok",
        "feedbacks": results
    })


def check_db_connection_and_list_tables():
    try:
        with connections['default'].cursor() as cur:
            # lightweight check
            cur.execute("SELECT 1")
        print("database connection successful")
    except DatabaseError:
        print("connection failed")

check_db_connection_and_list_tables()