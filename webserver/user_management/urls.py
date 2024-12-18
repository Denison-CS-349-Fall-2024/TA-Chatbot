from django.urls import path
from .views import UserRegisterView, UserLoginView, custom_redirect_view
from . import views


"""
User Management URL Configuration

This module defines URL patterns for user-related operations:
- User registration
- Authentication (login/logout)
- Profile management
- Role updates (student/professor)

Each path maps to a specific view function or class that handles the corresponding functionality.
"""

urlpatterns = [
    # User registration endpoint
    path('register/', UserRegisterView.as_view(), name='register'),
    
    # Authentication endpoints
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', views.customLogout, name='logout'),
    
    # User status verification
    path('is-authenticated/', views.is_user_authenticated, name='is_user_authenticated'),
    
    # Role management endpoints
    path("update-user-to-professor/", views.update_user_to_professor, name="update_user_to_professor"),
    path("update-user-to-student/", views.update_user_to_student, name="update_user_to_student"),
    
    # Profile redirection
    path('accounts/profile/', custom_redirect_view)
]
