from django.db import models
from user_management.models import User

class CourseManager(models.Manager):
    def create_course(self, name, section, pin, professor, department, course_number, semester, credits):
        course = self.create(name=name,section=section,pin=pin,professor=professor, department=department, semester=semester, course_number=course_number, is_active=True, credits=credits)
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
        
    def get_course_by_course_identifier(self, department, number, section):

        try:
            course = self.get(department = department, course_number = number, section = section)
            return course
        except Course.DoesNotExist:
            return ValueError("Could not find a course")


class Course(models.Model):
    name = models.CharField(max_length=255)
    section = models.CharField(max_length=255, default='01')
    department = models.CharField(max_length=255, default="NA")
    semester = models.CharField(max_length=255, default="fall2024") #default value needs to be udated
    course_number = models.IntegerField(default=0)
    pin = models.CharField(max_length=255)
    professor = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    credits = models.IntegerField(default=4)
    last_updated = models.DateTimeField(auto_now=True)
    objects = CourseManager()
    def __str__(self):
        return self.name
