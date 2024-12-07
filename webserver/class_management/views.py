from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Course
from user_management.models import User
import json
import random
import string
from datetime import datetime

def generate_random_string(length=6):
    # Define the possible characters (uppercase, lowercase, and digits)
    characters = string.ascii_letters + string.digits

    random_string = ''.join(random.choice(characters) for _ in range(length))
    return random_string

def get_current_semester():
    return f"{'spring' if datetime.now().month < 6 else 'fall'}{datetime.now().year}"


@csrf_exempt
def create_course(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  
            name = data.get('name')
            pin = generate_random_string()
            section = data.get('section')
            professor = data.get('professor_id')
            department = data.get('department')
            course_number = data.get('course_number')
            semester = get_current_semester()


            course = Course.objects.create_course(name=name, pin=pin, section=section, professor=professor, department=department, course_number = course_number, semester = semester)
            return JsonResponse({'message': 'Course created successfully', 'course_id': course.id}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

@csrf_exempt
def delete_course(request, course_id):
    if request.method == 'DELETE':
        try:
            course = get_object_or_404(Course, id=course_id)
            course.delete()
            return JsonResponse({'message': 'Course deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

def courses_by_professor(request, professor_id):
    try:
        professor = get_object_or_404(User, id=professor_id)
        courses = Course.objects.filter(professor=professor_id)
        courses_list = [{'id': course.id,'name': course.name, 'section':course.section, 'pin': course.pin, 'department': course.department, 'semester': course.semester, 'courseTitle': course.name, 'courseNumber': course.course_number} for course in courses]
        
        return JsonResponse({'courses': courses_list}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    