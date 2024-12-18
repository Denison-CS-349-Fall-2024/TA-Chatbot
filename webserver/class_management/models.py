from django.db import models
from user_management.models import User

"""
Class Management Models
Handles course data and operations.

This module provides:
- Course creation and management
- Course queries and filters
- Course metadata tracking
"""

class CourseManager(models.Manager):
    """
    Manager for course operations.
    
    Provides methods for creating, deleting, and querying courses.
    """

    def create_course(self, name, section, pin, professor, department, course_number, semester, credits):
        """
        Creates a new course with specified details.

        Args:
            name (str): Course name
            section (str): Course section
            pin (str): Course access PIN
            professor (int): Professor's ID
            department (str): Department code
            course_number (int): Course number
            semester (str): Academic semester
            credits (int): Course credits

        Returns:
            Course: Created course instance
        """
        course = self.create(
            name=name,
            section=section,
            pin=pin,
            professor=professor, 
            department=department, 
            semester=semester, 
            course_number=course_number, 
            is_active=True, 
            credits=credits
        )
        return course
    
    def delete_course(self, course_id):
        """
        Deletes a course by its ID.

        Args:
            course_id (int): Course identifier

        Returns:
            bool: True if deletion successful, False if course not found
        """
        try:
            course = self.get(id=course_id)
            course.delete()
            return True
        except Course.DoesNotExist:
            return False
        
    def get_course(self, course_id):
        """
        Retrieves a course by its ID.

        Args:
            course_id (int): Course identifier

        Returns:
            Course: Course instance

        Raises:
            ValueError: If course not found
        """
        try:
            course = self.get(id=course_id)
            return course
        except Course.DoesNotExist:
            return ValueError("Invalid Material ID")
        
    def get_course_by_course_identifier(self, semester, department, number, section):
        """
        Retrieves a course by its academic identifiers.

        Args:
            semester (str): Academic semester
            department (str): Department code
            number (int): Course number
            section (str): Section identifier

        Returns:
            Course: Course instance

        Raises:
            ValueError: If course not found
        """
        try:
            course = self.get(
                semester=semester, 
                department=department, 
                course_number=number, 
                section=section
            )
            return course
        except Course.DoesNotExist:
            return ValueError("Could not find a course")


class Course(models.Model):
    """
    Model representing an academic course.
    
    Attributes:
        name (CharField): Course name
        section (CharField): Course section
        department (CharField): Department code
        semester (CharField): Academic semester
        course_number (IntegerField): Course number
        pin (CharField): Course access PIN
        professor (CharField): Professor's ID
        is_active (BooleanField): Course active status
        credits (IntegerField): Course credits
        last_updated (DateTimeField): Last modification timestamp
    """
    name = models.CharField(max_length=255)
    section = models.CharField(max_length=255, default='01')
    department = models.CharField(max_length=255, default="NA")
    semester = models.CharField(max_length=255, default="fall2024")
    course_number = models.IntegerField(default=0)
    pin = models.CharField(max_length=255)
    professor = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    credits = models.IntegerField(default=4)
    last_updated = models.DateTimeField(auto_now=True)
    
    objects = CourseManager()

    def __str__(self):
        """
        String representation of the course.

        Returns:
            str: Course name
        """
        return self.name
