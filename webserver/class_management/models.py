from django.db import models
from user_management.models import User


class CourseManager(models.Manager):
    def create_course(self, name, section, pin, professor):
        course = self.create(name=name,section=section,pin=pin,professor=professor)
        return course
    
    def delete_course(self, course_id):
        try:
            course = self.get(id=course_id)
            course.delete()
            return True
        except Course.DoesNotExist:
            return False
        
    def get_course(self, course_id):
        try:
            course = self.get(id=course_id)
            return course
        except Course.DoesNotExist:
            return ValueError("Invalid Material ID")


class Course(models.Model):
    name = models.CharField(max_length=255)
    section = models.CharField(max_length=255, default='a')
    pin = models.CharField(max_length=255)
    professor = models.CharField(max_length=255)
    objects = CourseManager()
    def __str__(self):
        return self.name