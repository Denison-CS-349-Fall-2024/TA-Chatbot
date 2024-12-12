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
                return JsonResponse({
                    'error': 'A course with these details already exists',
                    'details': 'Course with the same section, number, and department already exists for this semester'
                }, status=409)  # 409 Conflict status code

            # Continue with course creation if no duplicate exists
            name = data.get('name')
            pin = generate_random_string()
            professor = data.get('professor_id')
            credits = data.get('credits')
            professor = get_object_or_404(User, id=professor)

            course = Course.objects.create_course(
                name=name,
                pin=pin,
                section=section,
                professor=professor.id,
                department=department,
                course_number=course_number,
                semester=semester,
                credits=credits
            )

            return JsonResponse({
                'message': 'Course created successfully',
                'course': {
                    'id': str(course.id),
                    'courseTitle': course.name,
                    'department': course.department,
                    'courseNumber': course.course_number,
                    'section': course.section,
                    'semester': course.semester,
                    'credits': course.credits,
                    'pin': course.pin,
                    'isActive': course.is_active,
                    'professorFirstName': professor.first_name,
                    'professorLastName': professor.last_name
                }
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

@csrf_exempt
def all_courses(request):
    if request.method == 'GET':
        courses = Course.objects.all()
        
        # Convert QuerySet to list of dictionaries
        courses_data = []

        for course in courses:
            professor = get_object_or_404(User, id=course.professor)
            courses_data.append({
                "id": str(course.id),
                "name": course.name,
                "courseTitle": course.name,
                "department": course.department,
                "courseNumber": course.course_number,
                "section": course.section,
                "semester": course.semester,
                "credits": str(course.credits),
                "professorFirstName": professor.first_name,
                "professorLastName": professor.last_name,
                "pin": course.pin,
                "isActive": course.is_active
            })
        
        return JsonResponse({'courses': courses_data}, status=200)
    
    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

@csrf_exempt
def update_course(request):
    if request.method == 'PUT':
        try:
            course_payload = json.loads(request.body)

            if (course_payload.get('id') == None):
                return JsonResponse({'error': 'Course ID is required'}, status=400)
            
            course = get_object_or_404(Course, id=course_payload.get('id'))

            if (course_payload.get('courseTitle') != None):
                course.name = course_payload.get('courseTitle')
            if (course_payload.get('department') != None):
                course.department = course_payload.get('department')
            if (course_payload.get('courseNumber') != None):
                course.course_number = course_payload.get('courseNumber')
            if (course_payload.get('section') != None):
                course.section = course_payload.get('section')
            if (course_payload.get('semester') != None):
                course.semester = course_payload.get('semester')
            if (course_payload.get('isActive') != None):
                course.is_active = course_payload.get('isActive')
            if (course_payload.get('credits') != None):
                course.credits = course_payload.get('credits')

            course.save()
            professor = get_object_or_404(User, id=course.professor)

            return JsonResponse({'message': 'Course updated successfully', 'course': {
                    'id': str(course.id),
                    'courseTitle': course.name,
                    'department': course.department,
                    'courseNumber': course.course_number,
                    'section': course.section,
                    'semester': course.semester,
                    'credits': course.credits,
                    'pin': course.pin,
                    'isActive': course.is_active,
                    'professorFirstName': professor.first_name,
                    'professorLastName': professor.last_name,
                    'lastUpdated': course.last_updated.isoformat()
                }}, status=200)
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
        courses_list = [{'id': course.id,'name': course.name, 'section':course.section, 'pin': course.pin, 'department': course.department, 'semester': course.semester, 'courseTitle': course.name, 'courseNumber': course.course_number, 'isActive': course.is_active, 'credits': course.credits, 'professorFirstName': professor.first_name, 'professorLastName': professor.last_name} for course in courses]
        
        return JsonResponse({'courses': courses_list}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
def get_course_details(request, semester, department, course_number, section):
    try:
        course = Course.objects.get_course_by_course_identifier(
            semester=semester,
            department=department,
            number=course_number,
            section=section
        )
        
        if not course:
            return JsonResponse({'error': 'Course not found'}, status=404)

        # Get enrolled students
        enrollments = StudentEnrollments.objects.get_enrollments_by_course(course.id)
        students_data = []
        
        for enrollment in enrollments:
            student = enrollment.student
            students_data.append({
                'id': str(student.id),
                'name': f"{student.first_name} {student.last_name}",
                'email': student.email,
                'status': 'Enrolled',
                'lastActive': student.last_login.isoformat() if student.last_login else None
            })

        professor = get_object_or_404(User, id=course.professor)
        
        return JsonResponse({
            'course': {
                'id': str(course.id),
                'courseTitle': course.name,
                'section': course.section,
                'department': course.department,
                'courseNumber': course.course_number,
                'semester': course.semester,
                'pin': course.pin,
                'credits': course.credits,
                'isActive': course.is_active,
                'lastUpdated': course.last_updated.isoformat(),
                'professorName': f"{professor.first_name} {professor.last_name}",
                'professorEmail': professor.email
            },
            'students': students_data
        }, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
@csrf_exempt
def update_course_settings(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            course_id = data.get('id')
            
            if not course_id:
                return JsonResponse({'error': 'Course ID is required'}, status=400)
            
            course = get_object_or_404(Course, id=course_id)
            
            # Update basic course information
            if 'courseTitle' in data:
                course.name = data['courseTitle']
            if 'section' in data:
                course.section = data['section']
            if 'department' in data:
                course.department = data['department']
            if 'courseNumber' in data:
                course.course_number = data['courseNumber']
            if 'credits' in data:
                course.credits = data['credits']
            if 'isActive' in data:
                course.is_active = data['isActive']
            
            # Update the last_updated timestamp
            course.last_updated = datetime.now()
            course.save()
            
            professor = get_object_or_404(User, id=course.professor)
            
            return JsonResponse({
                'message': 'Course settings updated successfully',
                'course': {
                    'id': str(course.id),
                    'courseTitle': course.name,
                    'department': course.department,
                    'courseNumber': course.course_number,
                    'section': course.section,
                    'semester': course.semester,
                    'credits': course.credits,
                    'pin': course.pin,
                    'isActive': course.is_active,
                    'professorFirstName': professor.first_name,
                    'professorLastName': professor.last_name,
                    'lastUpdated': course.last_updated.isoformat()
                }
            }, status=200)
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)
    