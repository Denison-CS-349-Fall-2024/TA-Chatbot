from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.post_material, name='post_material'),
    path('delete/<int:material_id>/', views.delete_material, name='delete_material'),
    path('all/<int:course_id>/', views.get_materials, name='get_materials'),
    path('<int:material_id>/', views.get_material, name='get_material'),
    path('update/<int:material_id>/', views.update_material, name='update_material'),
    path("get-materials-by-class-id/<str:classId>/", views.get_materials_by_class_id, name="get_materials_by_class_id"),
]
