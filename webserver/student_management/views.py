from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import StudentEnrollments
from class_management.models import Course
from user_management.models import User
import json


@csrf_exempt
def create_enrollment(request):
    """
    Creates a new enrollment for a student in a course.
    Expects JSON: { "student_id": <user_id>, "course_id": <course_id> }
    """

    if request.method == 'POST':
        data = json.loads(request.body)
        student_id = data.get('student_id')
        course_id = data.get('course_id')

        # Custom error handling for User
        try:
            student = User.objects.get(id=student_id)
        except User.DoesNotExist:
            return JsonResponse({
                "error": "Student not found",
                "details": f"No student exists with ID {student_id}",
                "error_code": "STUDENT_NOT_FOUND"
            }, status=404)

        # Custom error handling for Course
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return JsonResponse({
                "error": "Course not found",
                "details": f"No course exists with ID {course_id}",
                "error_code": "COURSE_NOT_FOUND"
            }, status=404)
        
        # Check for existing enrollment
        existing_enrollment = StudentEnrollments.objects.get_enrollments_by_student_and_course(student, course)
        if existing_enrollment is not None:
            return JsonResponse({
                "error": "Enrollment already exists",
                "details": f"Student {student.email} is already enrolled in {course.name}",
                "error_code": "DUPLICATE_ENROLLMENT"
            }, status=409)

        enrollment = StudentEnrollments.objects.create_enrollment(student, course)
        return JsonResponse({
            "message": "Enrollment created successfully.",
            "enrollment_id": enrollment.id,
        })

    return JsonResponse({"error": "Only POST requests are allowed."}, status=405)


@csrf_exempt
def delete_enrollment(request, enrollment_id):
    """
    Deletes an enrollment by its ID.
    """
    if request.method == 'DELETE':
        success = StudentEnrollments.objects.delete_enrollment(enrollment_id)

        if success:
            return JsonResponse({"message": "Enrollment deleted successfully."})
        return JsonResponse({"error": "Enrollment not found."}, status=404)

    return JsonResponse({"error": "Only DELETE requests are allowed."}, status=405)


def get_enrollments_by_student(request, student_id):
    """
    Retrieves all enrollments for a given student.
    """
    student = get_object_or_404(User, id=student_id)
    enrollments = StudentEnrollments.objects.get_enrollments_by_student(student)

    enrollment_data = []

    for enrollment in enrollments:
        professor = get_object_or_404(User, id=enrollment.course.professor)

        enrollment_data.append({
            "id": str(enrollment.course.id),
            "courseTitle": enrollment.course.name,
            "department": enrollment.course.department,
            "courseNumber": enrollment.course.course_number,
            "section": enrollment.course.section,
            "semester": enrollment.course.semester,
            "credits": str(enrollment.course.credits),
            "professorFirstName": professor.first_name,
            "professorLastName": professor.last_name,
            "pin": enrollment.course.pin,
            "isActive": enrollment.course.is_active
        })

    return JsonResponse({"enrollments": enrollment_data})

def get_enrollments_by_course(request, course_id):
    """
    Retrieves all enrollments for a given course.
    """
    course = get_object_or_404(Course, id=course_id)
    enrollments = StudentEnrollments.objects.get_enrollments_by_course(course)
    
    enrollment_data = [
        {
            "enrollment_id": enrollment.id,
            "student": {
                "id": str(enrollment.student.id),
                "email": enrollment.student.email,
                "isProf": hasattr(enrollment.student, 'professor') and enrollment.student.professor is not None,
                "firstName": enrollment.student.first_name,
                "lastName": enrollment.student.last_name
            }
        }
        for enrollment in enrollments
    ]
    
    return JsonResponse({"enrollments": enrollment_data})


def list_enrollments(request):
    """
    Lists all enrollments for administrative purposes.
    """
    enrollments = StudentEnrollments.objects.all()

    enrollment_data = [
        {
            "enrollment_id": enrollment.id,
            "student": {
                "id": str(enrollment.student.id),
                "email": enrollment.student.email,
                "isProf": enrollment.student.is_professor,
                "firstName": enrollment.student.first_name,
                "lastName": enrollment.student.last_name
            },
            "course": {
                "id": str(enrollment.course.id),
                "courseTitle": enrollment.course.name,
                "department": enrollment.course.department,
                "courseNumber": enrollment.course.course_number,
                "section": enrollment.course.section,
                "semester": enrollment.course.semester,
                "credits": str(enrollment.course.credits),
                "professorFirstName": enrollment.course.professor.first_name,
                "professorLastName": enrollment.course.professor.last_name,
                "pin": enrollment.course.pin,
                "isActive": enrollment.course.is_active
            }
        }
        for enrollment in enrollments
    ]

    return JsonResponse({"enrollments": enrollment_data})
