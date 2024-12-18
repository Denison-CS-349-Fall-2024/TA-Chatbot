from django.urls import path
from . import views

urlpatterns = [
    path('courses/create/', views.create_course, name='create_course'),
    path('courses/delete/<int:course_id>/', views.delete_course, name='delete_course'),
    path('courses/professor/<int:professor_id>/', views.courses_by_professor, name='courses_by_professor'),
    path('courses/update/', views.update_course, name='update_course'),
    path('courses/all/', views.all_courses, name='all_courses'),
    path('courses/<str:semester>/<str:department>/<int:course_number>/<str:section>/', 
         views.get_course_details, 
         name='get_course_details'),
]
