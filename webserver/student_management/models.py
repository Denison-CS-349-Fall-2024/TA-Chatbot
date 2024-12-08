from django.db import models
from user_management.models import User
from class_management.models import Course


class StudentEnrollmentsManager(models.Manager):
    def create_enrollment(self, student, course):
        enrollment = self.create(student=student, course=course)
        return enrollment

    def delete_enrollment(self, enrollment_id):
        try:
            enrollment = self.get(id=enrollment_id)
            enrollment.delete()
            return True
        except StudentEnrollments.DoesNotExist:
            return False
    def get_enrollments_by_student(self,user):
        try:
            courses = self.filter(student= user)
            return courses
        except StudentEnrollments.DoesNotExist:
            return ValueError("Could not find a course")
    def get_enrollments_by_course(self,course_id):
        try:
            students = self.filter(course = course_id)
            return students
        except StudentEnrollments.DoesNotExist:
            return ValueError("Could not find a course")
        

class StudentEnrollments(models.Model):
    student = models.ForeignKey(User,on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE,related_name='classes')

    object = StudentEnrollmentsManager()
    def __str__(self):
        return f"{self.student} enrolled in {self.course}"
