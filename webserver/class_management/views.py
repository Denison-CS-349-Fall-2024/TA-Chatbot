from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Course
from user_management.models import User
import json

@csrf_exempt
def create_course(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  
            name = data.get('name')
            pin = data.get('pin')
            section = data.get('section')
            professor = data.get('professor_id')
            print(data)

            course = Course.objects.create_course(name=name, pin=pin, section=section, professor=professor)
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
        courses = Course.objects.filter(professor=professor)
        courses_list = [{'id': course.id,'name': course.name, 'section':course.section, 'pin': course.pin} for course in courses]
        
        return JsonResponse({'courses': courses_list}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)