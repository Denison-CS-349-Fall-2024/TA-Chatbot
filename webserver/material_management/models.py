from django.db import models
from django.forms import ModelForm
from class_management.models import Course

class CourseMaterial(models.Model):
    title = models.CharField(max_length=255) 
    category = models.CharField(max_length=255)
    uploaded_file = models.FileField(upload_to='materials/')
    uploaded_date = models.DateTimeField(auto_now_add=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='materials')
    def __str__(self):
        return self.title

class CourseMaterialForm(forms.ModelForm):
    class Meta:
        model = CourseMaterial
        fields = ['title', 'course', 'category']
