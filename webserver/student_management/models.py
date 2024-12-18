from django.db import models
from user_management.models import User
from class_management.models import Course


class StudentEnrollmentsManager(models.Manager):
    """
    Manager for student enrollment operations.
    
    Provides methods for creating, deleting, and querying enrollments.
    """
    
    def create_enrollment(self, student, course):
        """
        Creates a new enrollment for a student in a course.

        Args:
            student (User): Student user object
            course (Course): Course object

        Returns:
            StudentEnrollments: Created enrollment instance
        """
        enrollment = self.create(student=student, course=course)
        return enrollment

    def delete_enrollment(self, enrollment_id):
        """
        Deletes an enrollment by its ID.

        Args:
            enrollment_id (int): ID of enrollment to delete

        Returns:
            bool: True if deletion successful, False if enrollment not found
        """
        try:
            enrollment = self.get(id=enrollment_id)
            enrollment.delete()
            return True
        except StudentEnrollments.DoesNotExist:
            return False

    def get_enrollments_by_student(self, user):
        """
        Retrieves all enrollments for a specific student.

        Args:
            user (User): Student user object

        Returns:
            QuerySet: Student's course enrollments

        Raises:
            ValueError: If student has no enrollments
        """
        try:
            courses = self.filter(student=user)
            return courses
        except StudentEnrollments.DoesNotExist:
            return ValueError("Could not find a course")

    def get_enrollments_by_course(self, course_id):
        """
        Retrieves all enrollments for a specific course.

        Args:
            course_id (int): Course identifier

        Returns:
            QuerySet: Course's student enrollments

        Raises:
            ValueError: If course has no enrollments
        """
        try:
            students = self.filter(course=course_id)
            return students
        except StudentEnrollments.DoesNotExist:
            return ValueError("Could not find a course")
        
    def get_enrollments_by_student_and_course(self, student_id, course_id):
        """
        Checks if a student is enrolled in a specific course.

        Args:
            student_id (int): Student identifier
            course_id (int): Course identifier

        Returns:
            StudentEnrollments: Enrollment instance if found, None otherwise
        """
        try:
            enrollments = self.filter(student=student_id, course=course_id)
            return enrollments.first()
        except StudentEnrollments.DoesNotExist:
            return None

class StudentEnrollments(models.Model):
    """
    Model representing student enrollment in courses.
    
    Attributes:
        student (ForeignKey): Reference to User model
        course (ForeignKey): Reference to Course model
    """
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='classes')

    objects = StudentEnrollmentsManager()

    def __str__(self):
        """
        String representation of the enrollment.

        Returns:
            str: Description of the enrollment
        """
        return f"{self.student} enrolled in {self.course}"
