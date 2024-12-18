from django.db import models
from user_management.models import User

class CourseManager(models.Manager):
    """
    Manager for handling course operations.
    """

    def create_course(self, name, section, pin, professor, department, course_number, semester, credits):
        """
        Creates a new course.
        
        Args:
            name (str): The name of the course.
            section (str): The section of the course.
            pin (str): The pin for the course.
            professor (User): The professor teaching the course.
            department (str): The department offering the course.
            course_number (int): The course number.
            semester (str): The semester in which the course is offered.
            credits (int): The number of credits for the course.
        
        Returns:
            Course: The created course object.
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
            course_id (int): The ID of the course to delete.
        
        Returns:
            bool: True if the course was deleted, False if it was not found.
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
            course_id (int): The ID of the course to retrieve.
        
        Returns:
            Course: The retrieved course object.
        
        Raises:
            ValueError: If the course does not exist.
        """
        try:
            course = self.get(id=course_id)
            return course
        except Course.DoesNotExist:
            raise ValueError("Invalid Course ID")
        
    def get_course_by_course_identifier(self, semester, department, number, section):
        """
        Retrieves a course by its identifier.
        
        Args:
            semester (str): The semester in which the course is offered.
            department (str): The department offering the course.
            number (int): The course number.
            section (str): The section of the course.
        
        Returns:
            Course: The retrieved course object.
        
        Raises:
            ValueError: If the course does not exist.
        """
        try:
            course = self.get(semester=semester, department=department, course_number=number, section=section)
            return course
        except Course.DoesNotExist:
            raise ValueError("Could not find a course")

class Course(models.Model):
    """
    Model representing a course.
    """
    name = models.CharField(max_length=255)
    section = models.CharField(max_length=255, default='01')
    department = models.CharField(max_length=255, default="NA")
    semester = models.CharField(max_length=255, default="fall2024")  # Default value needs to be updated
    course_number = models.IntegerField(default=0)
    pin = models.CharField(max_length=255, default='0000')
    professor = models.ForeignKey(User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    credits = models.IntegerField(default=3)

    objects = CourseManager()

    def __str__(self):
        return f"{self.name} ({self.department} {self.course_number}-{self.section})"