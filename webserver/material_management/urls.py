from django.urls import path
from . import views

urlpatterns = [
    path('materials/upload/', views.post_material, name='post_material'),
    path('materials/delete/<int:material_id>/', views.delete_material, name='delete_material'),
    path('materials/all/<int:course_id>/', views.get_materials, name='get_materials'),
    path('materials/<int:material_id>/', views.get_material, name='get_material'),
    path('materials/update/<int:material_id>/', views.update_material, name='update_material'),
]