from django.db import models
from class_management.models import Course

class CourseMaterialManager(models.Manager):
    def create_material(self, title, category, course):
        courseMaterial = self.create(title=title, category=category, course=course)
        return courseMaterial
    
    def delete_material(self, material_id):
        try:
            material = self.get(id=material_id)
            material.delete()
            return True
        except CourseMaterial.DoesNotExist:
            return False
        
    def get_file(self, material_id):
        try:
            material = self.get(id=material_id)
            return material
        except CourseMaterial.DoesNotExist:
            return ValueError("Invalid Material ID")

class CourseMaterial(models.Model):
    title = models.CharField(max_length=255) 
    category = models.CharField(max_length=255)
    uploaded_date = models.DateTimeField(auto_now_add=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='materials')
    objects = CourseMaterialManager()
    def __str__(self):
        return self.title