from django.urls import path
from . import views

"""
Material Management URL Configuration

This module defines URL patterns for course material operations:
- Material upload and storage
- Material deletion and updates
- Material retrieval and queries
- Course-specific material listings

Each path maps to a specific view function that handles material management functionality.
"""

urlpatterns = [
    # Material upload and management
    path('upload/', views.post_material, name='post_material'),
    path('delete/<int:material_id>/', views.delete_material, name='delete_material'),
    
    # Material retrieval endpoints
    path('all/<int:course_id>/', views.get_materials, name='get_materials'),
    path('<int:material_id>/', views.get_material, name='get_material'),
    
    # Material updates
    path('update/<int:material_id>/', views.update_material, name='update_material'),
    
    # Course-specific material queries
    path("get-materials-by-class-id/<str:semester>/<str:classId>/", 
         views.get_materials_by_class_id, 
         name="get_materials_by_class_id"),
]
