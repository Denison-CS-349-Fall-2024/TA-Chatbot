from django.db import models
from class_management.models import Course

"""
Material Management Models
Handles course material data and operations.

This module provides:
- Course material metadata storage
- Material queries and filters
- Material management operations
"""

class CourseMaterialManager(models.Manager):
    """
    Manager for course material operations.
    
    Provides methods for creating, deleting, and querying course materials.
    """

    def create_material(self, title, category, course, file_type, size):
        """
        Creates a new course material record.

        Args:
            title (str): Material title/filename
            category (str): Material category
            course (Course): Associated course
            file_type (str): File extension/type
            size (int): File size in bytes

        Returns:
            CourseMaterial: Created material instance
        """
        courseMaterial = self.create(
            title=title, 
            category=category, 
            course=course, 
            file_type=file_type, 
            size=size
        )
        return courseMaterial
    
    def delete_material(self, material_id):
        """
        Deletes a material record by its ID.

        Args:
            material_id (int): Material identifier

        Returns:
            bool: True if deletion successful, False if material not found
        """
        try:
            material = self.get(id=material_id)
            material.delete()
            return True
        except CourseMaterial.DoesNotExist:
            return False
        
    def get_file(self, material_id):
        """
        Retrieves a material record by its ID.

        Args:
            material_id (int): Material identifier

        Returns:
            CourseMaterial: Material instance

        Raises:
            ValueError: If material not found
        """
        try:
            material = self.get(id=material_id)
            return material
        except CourseMaterial.DoesNotExist:
            return ValueError("Invalid Material ID")
    
    def get_materials_by_course_id(self, course_id):
        """
        Retrieves all materials for a specific course.

        Args:
            course_id (int): Course identifier

        Returns:
            QuerySet: Course materials

        Raises:
            ValueError: If error occurs during retrieval
        """
        try:
            return self.filter(course_id=course_id)
        except:
            return ValueError("Error getting the materials")

class CourseMaterial(models.Model):
    """
    Model representing course material metadata.
    
    Attributes:
        title (CharField): Material title/filename
        category (CharField): Material category
        file_type (CharField): File extension/type
        size (IntegerField): File size in bytes
        uploaded_date (DateTimeField): Upload timestamp
        course (ForeignKey): Reference to Course model
    """
    title = models.CharField(max_length=255) 
    category = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50, default='docx') 
    size = models.IntegerField(default=5000) 
    uploaded_date = models.DateTimeField(auto_now_add=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='materials')
    
    objects = CourseMaterialManager()

    def __str__(self):
        """
        String representation of the material.

        Returns:
            str: Material title
        """
        return self.title
