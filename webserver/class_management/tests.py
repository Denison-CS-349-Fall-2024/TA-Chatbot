"""
Class Management Tests
Tests course-related operations and views.

This module tests:
- Course creation and deletion
- Course updates
- Course queries and filters
- Error handling
"""

from django.test import TestCase, Client
from django.urls import reverse
from .models import Course
from user_management.models import User
import json

class CourseViewsTestCase(TestCase):
    
    def setUp(self):
        """Initialize test environment before each test."""
        self.client = Client()
        
        # Create a test professor
        self.professor = User.objects.create_user(
            email="professor@test.com",
            password="testpass123",
            first_name="Alan",
            last_name="Turing",
            is_prof=True
        )

        # Test data for creating a course
        self.test_course_data = {
            'name': 'Data Science Basics',
            'section': '01',
            'department': 'CS',
            'course_number': 101,
            'semester': 'fall2024',
            'credits': 4,
            'professor_id': str(self.professor.id)
        }

        # Create an initial course for testing
        self.existing_course = Course.objects.create(
            name="Python Programming",
            section='01',
            department='CS',
            course_number=201,
            semester='fall2024',
            pin="XYZ789",
            professor=str(self.professor.id),
            credits=4
        )

    def test_create_course(self):
        """Test course creation functionality."""
        response = self.client.post(
            reverse('create_course'),
            data=json.dumps(self.test_course_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.content)
        self.assertEqual(data['course']['courseTitle'], 'Data Science Basics')
        self.assertTrue('pin' in data['course'])

    def test_delete_course(self):
        """Test course deletion functionality."""
        response = self.client.delete(
            reverse('delete_course', args=[self.existing_course.id])
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertFalse(Course.objects.filter(id=self.existing_course.id).exists())

    def test_get_course_details(self):
        """Test retrieving course details."""
        response = self.client.get(
            reverse('get_course_details', kwargs={
                'semester': self.existing_course.semester,
                'department': self.existing_course.department,
                'course_number': self.existing_course.course_number,
                'section': self.existing_course.section
            })
        )
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data['course']['courseTitle'], 'Python Programming')


    def test_courses_by_professor(self):
        """Test retrieving courses by professor."""
        response = self.client.get(
            reverse('courses_by_professor', args=[self.professor.id])
        )
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(len(data['courses']), 1)



