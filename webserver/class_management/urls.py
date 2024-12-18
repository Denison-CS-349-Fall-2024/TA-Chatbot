from django.urls import path
from . import views

"""
Class Management URL Configuration

This module defines URL patterns for course-related operations:
- Course creation and deletion
- Course updates and queries
- Professor-specific course listings
- Course detail retrieval

Each path maps to a specific view function that handles the corresponding functionality.
"""

urlpatterns = [
    # Course creation and deletion
    path('courses/create/', views.create_course, name='create_course'),
    path('courses/delete/<int:course_id>/', views.delete_course, name='delete_course'),
    
    # Course queries and listings
    path('courses/professor/<int:professor_id>/', views.courses_by_professor, name='courses_by_professor'),
    path('courses/all/', views.all_courses, name='all_courses'),
    
    # Course updates
    path('courses/update/', views.update_course, name='update_course'),
    
    # Detailed course information
    path('courses/<str:semester>/<str:department>/<int:course_number>/<str:section>/', 
         views.get_course_details, 
         name='get_course_details'),
]
