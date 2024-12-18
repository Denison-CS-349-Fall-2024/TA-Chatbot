from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import StudentEnrollments
from class_management.models import Course
from user_management.models import User
import json


"""
Student Management Views
Handles student enrollment operations and queries.

This module manages:
- Student course enrollments
- Enrollment queries
- Course roster management
"""


@csrf_exempt
def create_enrollment(request):
    """
    Creates a new enrollment for a student in a course.

    Args:
        request: HTTP request containing student_id and course_id

    Returns:
        JsonResponse: Enrollment status and details
    """
    if request.method == 'POST':
        # Parse request data
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

        # Create new enrollment
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

    Args:
        request: HTTP request
        enrollment_id (int): ID of enrollment to delete

    Returns:
        JsonResponse: Deletion status
    """
    if request.method == 'DELETE':
        # Attempt to delete enrollment
        success = StudentEnrollments.objects.delete_enrollment(enrollment_id)

        if success:
            return JsonResponse({"message": "Enrollment deleted successfully."})
        return JsonResponse({"error": "Enrollment not found."}, status=404)

    return JsonResponse({"error": "Only DELETE requests are allowed."}, status=405)


def get_enrollments_by_student(request, student_id):
    """
    Retrieves all course enrollments for a student.

    Args:
        request: HTTP request
        student_id (int): Student's unique identifier

    Returns:
        JsonResponse: List of student's course enrollments
    """
    # Get student object or return 404
    student = get_object_or_404(User, id=student_id)
    # Retrieve all enrollments for student
    enrollments = StudentEnrollments.objects.get_enrollments_by_student(student)

    enrollment_data = []

    # Build enrollment data list
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
    Retrieves all student enrollments for a course.

    Args:
        request: HTTP request
        course_id (int): Course's unique identifier

    Returns:
        JsonResponse: List of enrolled students
    """
    # Get course object or return 404
    course = get_object_or_404(Course, id=course_id)
    # Retrieve all enrollments for course
    enrollments = StudentEnrollments.objects.get_enrollments_by_course(course)
    
    # Build enrollment data list with student information
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

    Args:
        request: HTTP request

    Returns:
        JsonResponse: List of all enrollments with student and course details
    """
    # Retrieve all enrollments
    enrollments = StudentEnrollments.objects.all()

    # Build comprehensive enrollment data list
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
