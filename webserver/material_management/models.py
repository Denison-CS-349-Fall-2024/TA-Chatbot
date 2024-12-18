from django.db import models
from class_management.models import Course

class CourseMaterialManager(models.Manager):
    """
    Manager for handling course materials.
    """

    def create_material(self, title, category, course, file_type, size):
        """
        Creates a new course material.
        
        Args:
            title (str): The title of the material.
            category (str): The category of the material.
            course (Course): The course to which the material belongs.
            file_type (str): The type of the file.
            size (int): The size of the file.
        
        Returns:
            CourseMaterial: The created course material object.
        """
        courseMaterial = self.create(title=title, category=category, course=course, file_type=file_type, size=size)
        return courseMaterial
    
    def delete_material(self, material_id):
        """
        Deletes a course material by its ID.
        
        Args:
            material_id (int): The ID of the material to delete.
        
        Returns:
            bool: True if the material was deleted, False if it was not found.
        """
        try:
            material = self.get(id=material_id)
            material.delete()
            return True
        except CourseMaterial.DoesNotExist:
            return False
        
    def get_file(self, material_id):
        """
        Retrieves a course material by its ID.
        
        Args:
            material_id (int): The ID of the material to retrieve.
        
        Returns:
            CourseMaterial: The retrieved course material object.
        
        Raises:
            ValueError: If the material does not exist.
        """
        try:
            material = self.get(id=material_id)
            return material
        except CourseMaterial.DoesNotExist:
            raise ValueError("Invalid Material ID")
    
    def get_materials_by_course_id(self, course_id):
        """
        Retrieves all materials for a given course.
        
        Args:
            course_id (int): The ID of the course whose materials are to be retrieved.
        
        Returns:
            QuerySet: A queryset of materials for the course.
        
        Raises:
            ValueError: If there is an error getting the materials.
        """
        try:
            return self.filter(course_id=course_id)
        except:
            raise ValueError("Error getting the materials")

class CourseMaterial(models.Model):
    """
    Model representing course materials.
    """
    title = models.CharField(max_length=255) 
    category = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50, default='docx') 
    size = models.IntegerField(default=5000) 
    uploaded_date = models.DateTimeField(auto_now_add=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='materials')
    objects = CourseMaterialManager()

    def __str__(self):
        return self.title