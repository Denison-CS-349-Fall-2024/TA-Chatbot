from django.db import models
from class_management.models import Course

class CourseMaterialManager(models.Manager):
    def create_material(self, title, category, course, file_type, size):
        courseMaterial = self.create(title=title, category=category, course=course, file_type=file_type, size=size)
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
    
    def get_materials_by_course_id(self, course_id):
        try:
            return self.filter(course_id=course_id)
        except:
            return ValueError("Error getting the materials")
class CourseMaterial(models.Model):
    title = models.CharField(max_length=255) 
    category = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50, default='docx') 
    size = models.IntegerField(default=5000) 
    uploaded_date = models.DateTimeField(auto_now_add=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='materials')
    objects = CourseMaterialManager()
    def __str__(self):
        return self.title
