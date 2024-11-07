from django import forms
from django.db import models
from class_management.models import Course

class CourseMaterialManager(models.Manager):

    def create_material(self, title, category, course):

        courseMaterial = self.create(title=title, category = category, course=course)
        return courseMaterial

class CourseMaterial(models.Model):
    title = models.CharField(max_length=255) 
    category = models.CharField(max_length=255)
    # uploaded_file = models.FileField(upload_to='materials/')
    uploaded_date = models.DateTimeField(auto_now_add=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='materials')

    objects = CourseMaterialManager()

    def __str__(self):
        return self.title

class CourseMaterialForm(forms.ModelForm):
    class Meta:
        model = CourseMaterial
        fields = ['title', 'course', 'category']
