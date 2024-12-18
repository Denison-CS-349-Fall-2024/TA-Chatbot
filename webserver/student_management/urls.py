from django.urls import path
from . import views

"""
Student Management URL Configuration

This module defines URL patterns for enrollment-related operations:
- Student enrollment creation
- Student-specific enrollment queries
- Course roster retrieval
- Enrollment management

Each path maps to a specific view function that handles student enrollment functionality.
"""

urlpatterns = [
    # Enrollment creation endpoint
    path('enrollments/create/', 
         views.create_enrollment, 
         name='create_enrollment'),
    
    # Student-specific enrollment queries
    path('enrollments/student/<int:student_id>/', 
         views.get_enrollments_by_student, 
         name='get_enrollments_by_student'),
    
    # Course roster retrieval
    path('enrollments/class/<int:course_id>/', 
         views.get_enrollments_by_course, 
         name='get_enrollments_by_course'),
]
