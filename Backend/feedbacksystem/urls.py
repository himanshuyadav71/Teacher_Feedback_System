from django.contrib import admin
from django.urls import path
from feedback_app import views as feedback_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', feedback_views.login, name='login'),
    path('logout/', feedback_views.logout, name='logout'),
    path("my-teachers/", feedback_views.my_teachers),
    path("submit-feedback/", feedback_views.submit_feedback),
]
