from django.db import models
from user_management.models import User
from class_management.models import Course

class StudentEnrollmentsManager(models.Manager):
    """
    Manager for handling student enrollments.
    """

    def create_enrollment(self, student, course):
        """
        Creates a new enrollment for a student in a course.
        
        Args:
            student (User): The student to enroll.
            course (Course): The course to enroll the student in.
        
        Returns:
            StudentEnrollments: The created enrollment object.
        """
        enrollment = self.create(student=student, course=course)
        return enrollment

    def delete_enrollment(self, enrollment_id):
        """
        Deletes an enrollment by its ID.
        
        Args:
            enrollment_id (int): The ID of the enrollment to delete.
        
        Returns:
            bool: True if the enrollment was deleted, False if it was not found.
        """
        try:
            enrollment = self.get(id=enrollment_id)
            enrollment.delete()
            return True
        except StudentEnrollments.DoesNotExist:
            return False

    def get_enrollments_by_student(self, user):
        """
        Retrieves all enrollments for a given student.
        
        Args:
            user (User): The student whose enrollments are to be retrieved.
        
        Returns:
            QuerySet: A queryset of enrollments for the student.
        """
        try:
            courses = self.filter(student=user)
            return courses
        except StudentEnrollments.DoesNotExist:
            raise ValueError("Could not find a course")

    def get_enrollments_by_course(self, course_id):
        """
        Retrieves all enrollments for a given course.
        
        Args:
            course_id (int): The ID of the course whose enrollments are to be retrieved.
        
        Returns:
            QuerySet: A queryset of enrollments for the course.
        """
        try:
            students = self.filter(course=course_id)
            return students
        except StudentEnrollments.DoesNotExist:
            raise ValueError("Could not find a course")

    def get_enrollments_by_student_and_course(self, student_id, course_id):
        """
        Retrieves an enrollment for a given student and course.
        
        Args:
            student_id (int): The ID of the student.
            course_id (int): The ID of the course.
        
        Returns:
            StudentEnrollments: The enrollment object, or None if not found.
        """
        try:
            enrollments = self.filter(student=student_id, course=course_id)
            return enrollments.first()
        except StudentEnrollments.DoesNotExist:
            return None

class StudentEnrollments(models.Model):
    """
    Model representing student enrollments.
    """
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    objects = StudentEnrollmentsManager()