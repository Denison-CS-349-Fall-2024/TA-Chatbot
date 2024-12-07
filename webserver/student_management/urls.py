from django.urls import path
from . import views

urlpatterns = [
    path('enrollments/create/', views.create_enrollment, name='create_enrollment'),
    path('enrollments/student/<int:student_id>/', views.get_enrollments_by_student, name='get_enrollments_by_student'),
]
