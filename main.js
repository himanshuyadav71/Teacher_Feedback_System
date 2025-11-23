// Teacher Feedback System - Main JavaScript File

// Global Variables
let currentQuestionIndex = 0;
let feedbackData = {};
let selectedTeacher = null;
let currentUser = null;

// Mock Data
const teachers = [
    { id: 1, name: "Dr. prashant lakkadhwala", subject: "operating system", department: "IT-HOD" },
    { id: 2, name: "Prof. brajesh chaturvedi ", subject: "", department: "IT-Vice-HOD" },
    { id: 3, name: "Dr. deepak singh chouhan", subject: "Oops", department: "IT" },
    { id: 4, name: "Prof. ankita agarwal", subject: "A.I.", department: "IT" },
    { id: 5, name: "Dr. kapil sahu", subject: "ADA", department: "IT" },
    { id: 6, name: "Prof. Ppawan makhija", subject: "OOAD", department: "IT" },
    { id: 7, name: "Dr. disha sharma", subject: "OS lab", department: "IT" },
    { id: 8, name: "Prof. monika choudhary", subject: "adv. java lab", department: "IT" }
];

const feedbackQuestions = [
    {
        title: "Clarity of Instruction",
        description: "How clearly does the teacher explain concepts and course materials?"
    },
    {
        title: "Engagement & Interaction",
        description: "How well does the teacher engage students and encourage participation?"
    },
    {
        title: "Knowledge & Expertise",
        description: "How knowledgeable is the teacher in their subject area?"
    },
    {
        title: "Accessibility & Support",
        description: "How accessible and supportive is the teacher outside of class?"
    },
    {
        title: "Course Organization",
        description: "How well-organized and structured are the course materials and lessons?"
    },
    {
        title: "Assessment Fairness",
        description: "How fair and transparent are the grading and assessment methods?"
    },
    {
        title: "Technology Integration",
        description: "How effectively does the teacher use technology to enhance learning?"
    },
    {
        title: "Classroom Management",
        description: "How well does the teacher manage classroom dynamics and maintain a positive environment?"
    },
    {
        title: "Feedback Quality",
        description: "How constructive and helpful is the feedback provided on assignments and exams?"
    },
    {
        title: "Overall Teaching Effectiveness",
        description: "How would you rate the teacher's overall effectiveness in helping you learn?"
    }
];

const users = [
    { id: 1, name: "John Smith", role: "Student", email: "john.smith@student.edu", status: "Active" },
    { id: 2, name: "Sarah Johnson", role: "Teacher", email: "sarah.johnson@school.edu", status: "Active" },
    { id: 3, name: "Mike Davis", role: "Student", email: "mike.davis@student.edu", status: "Active" },
    { id: 4, name: "Emily Wilson", role: "Teacher", email: "emily.wilson@school.edu", status: "Inactive" },
    { id: 5, name: "Alex Brown", role: "Student", email: "alex.brown@student.edu", status: "Active" },
    { id: 6, name: "Lisa Garcia", role: "Teacher", email: "lisa.garcia@school.edu", status: "Active" }
];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            initializeLandingPage();
            break;
        case 'login':
            initializeLoginPage();
            break;
        case 'feedback':
            initializeFeedbackPage();
            break;
        case 'dashboard':
            initializeDashboardPage();
            break;
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('login.html')) return 'login';
    if (path.includes('feedback.html')) return 'feedback';
    if (path.includes('dashboard.html')) return 'dashboard';
    return 'index';
}

// Landing Page Functions
function initializeLandingPage() {
    initializeTypedText();
    initializeParticleBackground();
    initializeScrollAnimations();
    initializeMobileMenu();
}

function initializeTypedText() {
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: [
                'Your Insight Drives Our Innovation',
                'Tell Us. Improve Us. Grow Together',
                'Acropolis Tech Excellence Starts With You'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true
        });
    }
}

function initializeParticleBackground() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    function createParticles() {
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }

    createParticles();
    animate();
}

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            // Mobile menu toggle functionality
            console.log('Mobile menu clicked');
        });
    }
}

// Login Page Functions
function initializeLoginPage() {
    initializeLoginTabs();
    initializePasswordStrength();
    initializeTogglePassword();
    initializeLoginForms();
}

function initializeLoginTabs() {
    const studentTab = document.getElementById('student-tab');
    const adminTab = document.getElementById('admin-tab');
    const studentForm = document.getElementById('student-form');
    const adminForm = document.getElementById('admin-form');

    if (studentTab && adminTab) {
        studentTab.addEventListener('click', () => {
            studentTab.classList.add('tab-active');
            studentTab.classList.remove('tab-inactive');
            adminTab.classList.add('tab-inactive');
            adminTab.classList.remove('tab-active');
            studentForm.classList.remove('hidden');
            adminForm.classList.add('hidden');
        });

        adminTab.addEventListener('click', () => {
            adminTab.classList.add('tab-active');
            adminTab.classList.remove('tab-inactive');
            studentTab.classList.add('tab-inactive');
            studentTab.classList.remove('tab-active');
            adminForm.classList.remove('hidden');
            studentForm.classList.add('hidden');
        });
    }
}

function initializePasswordStrength() {
    const adminPassword = document.getElementById('admin-password');
    const strengthBar = document.getElementById('password-strength-bar');
    const strengthText = document.getElementById('password-strength-text');

    if (adminPassword) {
        adminPassword.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updatePasswordStrengthUI(strength);
        });
    }
}

function calculatePasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    return score;
}

function updatePasswordStrengthUI(strength) {
    const strengthBar = document.getElementById('password-strength-bar');
    const strengthText = document.getElementById('password-strength-text');
    
    if (!strengthBar || !strengthText) return;

    strengthBar.className = 'password-strength';
    
    if (strength <= 2) {
        strengthBar.classList.add('strength-weak');
        strengthText.textContent = 'Weak';
        strengthText.className = 'font-medium text-red-600';
    } else if (strength <= 4) {
        strengthBar.classList.add('strength-medium');
        strengthText.textContent = 'Medium';
        strengthText.className = 'font-medium text-yellow-600';
    } else {
        strengthBar.classList.add('strength-strong');
        strengthText.textContent = 'Strong';
        strengthText.className = 'font-medium text-green-600';
    }
}

function initializeTogglePassword() {
    const toggleButtons = document.querySelectorAll('[id$="-toggle-password"]');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const inputId = this.id.replace('-toggle-password', '');
            const input = document.getElementById(inputId + '-password') || document.getElementById(inputId);
            
            if (input) {
                input.type = input.type === 'password' ? 'text' : 'password';
            }
        });
    });
}

function initializeLoginForms() {
    const studentForm = document.getElementById('student-login-form');
    const adminForm = document.getElementById('admin-login-form');

    if (studentForm) {
        studentForm.addEventListener('submit', handleStudentLogin);
    }

    if (adminForm) {
        adminForm.addEventListener('submit', handleAdminLogin);
    }
}

function handleStudentLogin(e) {
    e.preventDefault();
    const studentId = document.getElementById('student-id').value;
    const password = document.getElementById('student-password').value;

    // Mock authentication
    if (studentId === 'student123' && password === 'password123') {
        currentUser = { id: studentId, role: 'student' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href = 'feedback.html';
    } else {
        showNotification('Invalid credentials. Please try again.', 'error');
    }
}

function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    // Mock authentication
    if (email === 'admin@school.edu' && password === 'admin123') {
        currentUser = { id: email, role: 'admin' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href = 'dashboard.html';
    } else {
        showNotification('Invalid admin credentials. Please try again.', 'error');
    }
}

// Feedback Page Functions
function initializeFeedbackPage() {
    checkAuthentication();
    // Debug: print teachers loaded by the page
    try { console.log('teachers (page):', teachers); } catch (e) {}
    initializeTeacherSearch();
    initializeTeacherSelect();
    initializeFeedbackForm();
    initializeLogoutButton();
}

function checkAuthentication() {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(storedUser);
    if (currentUser.role !== 'student') {
        window.location.href = 'login.html';
    }
}

function initializeTeacherSearch() {
    const searchInput = document.getElementById('teacher-search');
    const teacherList = document.getElementById('teacher-list');

    if (searchInput && teacherList) {
        renderTeacherList(teachers);
        
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const filteredTeachers = teachers.filter(teacher => 
                teacher.name.toLowerCase().includes(query) || 
                teacher.subject.toLowerCase().includes(query)
            );
            renderTeacherList(filteredTeachers);
        });
    }
}

// Populate teacher select dropdown (if present) and handle selection
function initializeTeacherSelect() {
    const teacherSelect = document.getElementById('teacher-select');
    if (!teacherSelect) return;

    // Populate options
    teachers.forEach(teacher => {
        const opt = document.createElement('option');
        opt.value = teacher.id;
        opt.textContent = teacher.name + (teacher.subject ? ` — ${teacher.subject}` : '');
        teacherSelect.appendChild(opt);
    });

    // When a teacher is chosen from the select, use it and show the feedback form
    teacherSelect.addEventListener('change', function() {
        const id = parseInt(this.value, 10);
        if (!id) return;
        const teacher = teachers.find(t => t.id === id);
        if (teacher) {
            selectTeacher(teacher);
        }
    });
}

function renderTeacherList(teacherList) {
    const teacherListElement = document.getElementById('teacher-list');
    if (!teacherListElement) return;

    teacherListElement.innerHTML = '';
    
    teacherList.forEach(teacher => {
        const teacherElement = document.createElement('div');
        teacherElement.className = 'p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors';
        teacherElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <h4 class="font-medium text-gray-900">${teacher.name}</h4>
                    <p class="text-sm text-gray-600">${teacher.subject} • ${teacher.department}</p>
                </div>
                <div class="text-sm text-gray-500">${teacher.department}</div>
            </div>
        `;
        
        teacherElement.addEventListener('click', () => selectTeacher(teacher));
        teacherListElement.appendChild(teacherElement);
    });
}

function selectTeacher(teacher) {
    selectedTeacher = teacher;
    // Update selected teacher UI in question card
    const sel = document.getElementById('selected-teacher');
    const selName = document.getElementById('selected-teacher-name');
    if (selName) selName.textContent = teacher.name + (teacher.subject ? ` — ${teacher.subject}` : ` — ${teacher.department}`);
    if (sel) sel.classList.remove('hidden');
    document.getElementById('teacher-selection').classList.add('hidden');
    document.getElementById('feedback-form').classList.remove('hidden');
    initializeFeedbackQuestions();
}

function initializeFeedbackForm() {
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const submitBtn = document.getElementById('submit-feedback');
    const startOverBtn = document.getElementById('start-over');

    if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
    if (prevBtn) prevBtn.addEventListener('click', prevQuestion);
    if (submitBtn) submitBtn.addEventListener('click', submitFeedback);
    if (startOverBtn) startOverBtn.addEventListener('click', startOver);
}

function initializeFeedbackQuestions() {
    currentQuestionIndex = 0;
    feedbackData = { teacherId: selectedTeacher.id, responses: {} };
    showQuestion(currentQuestionIndex);
}

function showQuestion(index) {
    const question = feedbackQuestions[index];
    const questionCard = document.getElementById('question-template');
    
    if (!questionCard) return;

    // Update question content
    document.getElementById('question-title').textContent = question.title;
    document.getElementById('question-description').textContent = question.description;
    document.getElementById('question-number').textContent = index + 1;

    // Update rating container
    const ratingContainer = questionCard.querySelector('.rating-container');
    ratingContainer.setAttribute('data-question', index);
    
    // Reset rating stars
    const stars = ratingContainer.querySelectorAll('.rating-star');
    stars.forEach(star => {
        star.classList.remove('selected');
        star.addEventListener('click', () => selectRating(index, parseInt(star.dataset.rating)));
    });

    // Update navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    prevBtn.disabled = index === 0;
    nextBtn.textContent = index === feedbackQuestions.length - 1 ? 'Complete' : 'Next Question';

    // Update progress
    updateProgress();

    // Animate question card
    anime({
        targets: questionCard,
        opacity: [0, 1],
        translateX: [50, 0],
        duration: 500,
        easing: 'easeOutQuart'
    });
}

function selectRating(questionIndex, rating) {
    feedbackData.responses[questionIndex] = rating;
    
    // Update UI
    const ratingContainer = document.querySelector(`[data-question="${questionIndex}"]`);
    const stars = ratingContainer.querySelectorAll('.rating-star');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });

    // Enable next button
    const nextBtn = document.getElementById('next-btn');
    nextBtn.disabled = false;
}

function nextQuestion() {
    if (currentQuestionIndex < feedbackQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    } else {
        showSubmitSection();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / feedbackQuestions.length) * 100;
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${currentQuestionIndex + 1} of ${feedbackQuestions.length} completed`;
    }
}

function showSubmitSection() {
    document.getElementById('feedback-form').classList.add('hidden');
    document.getElementById('submit-section').classList.remove('hidden');
}

function submitFeedback() {
    // Simulate API call
    setTimeout(() => {
        document.getElementById('success-modal').classList.remove('hidden');
        
        // Confetti effect
        createConfetti();
    }, 1000);
}

function startOver() {
    currentQuestionIndex = 0;
    feedbackData = {};
    selectedTeacher = null;
    
    document.getElementById('submit-section').classList.add('hidden');
    document.getElementById('feedback-form').classList.add('hidden');
    document.getElementById('teacher-selection').classList.remove('hidden');
    
    document.getElementById('teacher-search').value = '';
    renderTeacherList(teachers);
    // Clear selected teacher UI
    const sel = document.getElementById('selected-teacher');
    const selName = document.getElementById('selected-teacher-name');
    if (selName) selName.textContent = '';
    if (sel) sel.classList.add('hidden');
}

function createConfetti() {
    // Simple confetti effect
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);
        
        anime({
            targets: confetti,
            translateY: '100vh',
            rotate: '360deg',
            duration: 3000,
            easing: 'easeInQuart',
            complete: () => confetti.remove()
        });
    }
}

// Dashboard Page Functions
function initializeDashboardPage() {
    checkAdminAuthentication();
    initializeSidebarNavigation();
    initializeDashboardCharts();
    initializeUserManagement();
    initializePowerBI();
    initializeLogoutButton();
}

function checkAdminAuthentication() {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(storedUser);
    if (currentUser.role !== 'admin') {
        window.location.href = 'login.html';
    }
}

function initializeSidebarNavigation() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const sections = document.querySelectorAll('.section-content');

    sidebarItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            sidebarItems.forEach(si => si.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all sections
            sections.forEach(section => section.classList.add('hidden'));
            
            // Show selected section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId + '-section');
            if (targetSection) {
                targetSection.classList.remove('hidden');
            }
        });
    });
}

function initializeDashboardCharts() {
    initializeFeedbackTrendsChart();
    initializeTeacherPerformanceChart();
    initializeDepartmentChart();
    initializeDistributionChart();
}

function initializeFeedbackTrendsChart() {
    const chartElement = document.getElementById('feedback-trends-chart');
    if (!chartElement) return;

    const chart = echarts.init(chartElement);
    
    const option = {
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: 'Feedback Submitted',
            type: 'line',
            data: [120, 200, 150, 80, 70, 110],
            smooth: true,
            lineStyle: {
                color: '#3b82f6'
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(59, 130, 246, 0.3)'
                    }, {
                        offset: 1, color: 'rgba(59, 130, 246, 0.1)'
                    }]
                }
            }
        }]
    };

    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

function initializeTeacherPerformanceChart() {
    const chartElement = document.getElementById('teacher-performance-chart');
    if (!chartElement) return;

    const chart = echarts.init(chartElement);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: ['Dr. Johnson', 'Prof. Chen', 'Dr. Rodriguez', 'Prof. Kim', 'Dr. Wang']
        },
        yAxis: {
            type: 'value',
            max: 5
        },
        series: [{
            name: 'Average Rating',
            type: 'bar',
            data: [4.2, 4.5, 3.8, 4.7, 4.1],
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: '#10b981'
                    }, {
                        offset: 1, color: '#059669'
                    }]
                }
            }
        }]
    };

    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

function initializeDepartmentChart() {
    const chartElement = document.getElementById('department-chart');
    if (!chartElement) return;

    const chart = echarts.init(chartElement);
    
    const option = {
        tooltip: {
            trigger: 'item'
        },
        series: [{
            name: 'Department Performance',
            type: 'pie',
            radius: '70%',
            data: [
                { value: 4.2, name: 'Computer Science' },
                { value: 4.5, name: 'Data Science' },
                { value: 3.9, name: 'Software Engineering' },
                { value: 4.1, name: 'Information Technology' }
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };

    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

function initializeDistributionChart() {
    const chartElement = document.getElementById('distribution-chart');
    if (!chartElement) return;

    const chart = echarts.init(chartElement);
    
    const option = {
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: 'Feedback Count',
            type: 'bar',
            data: [12, 25, 89, 156, 234],
            itemStyle: {
                color: '#f59e0b'
            }
        }]
    };

    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

function initializeUserManagement() {
    const usersTableBody = document.getElementById('users-table-body');
    if (!usersTableBody) return;

    renderUsersTable();

    const addUserBtn = document.getElementById('add-user');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', showAddUserModal);
    }
}

function renderUsersTable() {
    const usersTableBody = document.getElementById('users-table-body');
    if (!usersTableBody) return;

    usersTableBody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                        <span class="text-white font-bold text-sm">${user.name.charAt(0)}</span>
                    </div>
                    <div class="text-sm font-medium text-gray-900">${user.name}</div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'Student' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }">
                    ${user.role}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.email}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }">
                    ${user.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-primary hover:text-blue-800 mr-3">Edit</button>
                <button class="text-red-600 hover:text-red-800">Delete</button>
            </td>
        `;
        usersTableBody.appendChild(row);
    });
}

function showAddUserModal() {
    showNotification('Add User functionality would open a modal here', 'info');
}

function initializePowerBI() {
    const loadPowerBIBtn = document.getElementById('load-powerbi');
    const refreshBtn = document.getElementById('refresh-dashboard');
    const exportBtn = document.getElementById('export-dashboard');

    if (loadPowerBIBtn) {
        loadPowerBIBtn.addEventListener('click', loadPowerBIDashboard);
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshDashboard);
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', exportDashboard);
    }
}

function loadPowerBIDashboard() {
    const container = document.querySelector('.powerbi-container');
    if (container) {
        container.innerHTML = `
            <div class="w-full h-full bg-white rounded-lg p-6">
                <div class="flex items-center justify-center h-full">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Loading Power BI Dashboard...</h4>
                        <p class="text-gray-600">Connecting to Power BI service</p>
                    </div>
                </div>
            </div>
        `;

        // Simulate loading
        setTimeout(() => {
            container.innerHTML = `
                <div class="w-full h-full bg-white rounded-lg p-6">
                    <div class="flex items-center justify-center h-full">
                        <div class="text-center">
                            <div class="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h4 class="text-lg font-semibold text-gray-900 mb-2">Power BI Dashboard Loaded</h4>
                            <p class="text-gray-600 mb-4">Interactive analytics dashboard is now available</p>
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div class="bg-blue-50 p-3 rounded-lg">
                                    <div class="font-semibold text-blue-900">Real-time Data</div>
                                    <div class="text-blue-700">Live updates</div>
                                </div>
                                <div class="bg-green-50 p-3 rounded-lg">
                                    <div class="font-semibold text-green-900">Interactive Charts</div>
                                    <div class="text-green-700">Click to explore</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }, 2000);
    }
}

function refreshDashboard() {
    showNotification('Dashboard data refreshed successfully', 'success');
}

function exportDashboard() {
    showNotification('Export functionality would download a PDF report', 'info');
}

// Common Functions
function initializeLogoutButton() {
    const logoutButtons = document.querySelectorAll('#logout-btn');
    
    logoutButtons.forEach(button => {
        button.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white max-w-sm ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
    
    // Animate in
    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });
}

// Initialize success modal close button
document.addEventListener('DOMContentLoaded', function() {
    const closeModalBtn = document.getElementById('close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            document.getElementById('success-modal').classList.add('hidden');
            window.location.href = 'index.html';
        });
    }
});

// Export functions for global access
window.TeacherFeedbackSystem = {
    showNotification,
    createConfetti,
    loadPowerBIDashboard
};