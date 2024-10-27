from django.db import models
from user_management.models import User


class CourseManager(models.Manager):
    def create_course(self, name, pin, professor):
        self.create(name=name, pin=pin,professor=professor)

class Course(models.Model):
    name = models.CharField(max_length=255)
    pin = models.CharField(max_length=255)
    professor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='classes')
    objects = CourseManager()
    def __str__(self):
        return self.name

