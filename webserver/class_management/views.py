from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Course
from user_management.models import User
import json
import random
import string
from datetime import datetime
from student_management.models import StudentEnrollments

def generate_random_string(length=6):
    """
    Generates a random string of the specified length.
    
    Args:
        length (int): The length of the random string. Default is 6.
    
    Returns:
        str: A random string of the specified length.
    """
    characters = string.ascii_letters + string.digits
    random_string = ''.join(random.choice(characters) for _ in range(length))
    return random_string

def get_current_semester():
    """
    Retrieves the current semester based on the current date.
    
    Returns:
        str: The current semester in the format 'springYYYY' or 'fallYYYY'.
    """
    return f"{'spring' if datetime.now().month < 6 else 'fall'}{datetime.now().year}"

@csrf_exempt
def create_course(request):
    """
    Creates a new course.
    
    Args:
        request (HttpRequest): The HTTP request object.
    
    Returns:
        JsonResponse: A JSON response indicating success or failure.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            section = data.get('section')
            department = data.get('department')
            course_number = data.get('course_number')
            semester = data.get('semester', get_current_semester())

            # Check for existing course with same details
            existing_course = Course.objects.filter(
                section=section,
                department=department,
                course_number=course_number,
                semester=semester
            ).first()

            if existing_course:
                return JsonResponse({"error": "Course already exists."}, status=400)

            course = Course.objects.create(
                section=section,
                department=department,
                course_number=course_number,
                semester=semester
            )

            return JsonResponse({"message": "Course created successfully.", "course_id": course.id}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Only POST requests are allowed."}, status=405)