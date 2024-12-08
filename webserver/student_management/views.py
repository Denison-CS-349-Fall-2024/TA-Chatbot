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

        student = get_object_or_404(User, id=student_id)
        course = get_object_or_404(Course, id=course_id)

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

    enrollment_data = [
        {
            "enrollment_id": enrollment.id,
            "course_name": enrollment.course.name,
            "course_id": enrollment.course.id,
        }
        for enrollment in enrollments
    ]

    return JsonResponse({"enrollments": enrollment_data})

def get_enrollments_by_course(request, course_id):
    course = get_object_or_404(Course, id=course_id)
    enrollments = StudentEnrollments.objects.get_enrollments_by_course(course)
    enrollment_data = [
        {
            "student_name":enrollment.student.name
        }
        for enrollment in enrollments
    ]
    JsonResponse({"enrollments": enrollment_data})


def list_enrollments(request):
    """
    Lists all enrollments for administrative purposes.
    """
    enrollments = StudentEnrollments.objects.all()

    enrollment_data = [
        {
            "enrollment_id": enrollment.id,
            "student_name": enrollment.student_id.username,
            "course_name": enrollment.course.name,
        }
        for enrollment in enrollments
    ]

    return JsonResponse({"enrollments": enrollment_data})
