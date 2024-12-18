"""
Material Management Tests
Tests course material operations and views.

This module tests:
- Material upload and storage
- Material retrieval
- Material deletion
- Course-specific material queries
"""

from django.test import TestCase, Client
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import CourseMaterial
from class_management.models import Course
from user_management.models import User
import json

class MaterialManagementTestCase(TestCase):
    def setUp(self):
        """Initialize test environment before each test."""
        self.client = Client()
        
        # Create test professor
        self.professor = User.objects.create_user(
            email="professor@test.com",
            password="testpass123",
            first_name="Alan",
            last_name="Turing",
            is_prof=True
        )
        
        # Create test course
        self.course = Course.objects.create(
            name="Python Programming",
            section='01',
            department='CS',
            course_number=201,
            semester='fall2024',
            pin="XYZ789",
            professor=str(self.professor.id),
            credits=4
        )
        
        # Create test material
        self.material = CourseMaterial.objects.create(
            title="Test Material",
            category="lecture",
            file_type="pdf",
            size=1024,
            course=self.course
        )

    def test_get_material(self):
        """Test retrieving a specific material."""
        url = f"/api/materials/{self.material.id}/"
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data['material']['title'], "Test Material")

    def test_delete_material(self):
        """Test material deletion."""
        url = f"/api/materials/delete/{self.material.id}/"
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, 200)
        self.assertFalse(CourseMaterial.objects.filter(id=self.material.id).exists())

    def test_get_materials(self):
        """Test retrieving all materials for a course."""
        url = f"/api/materials/all/{self.course.id}/"
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(len(data['materials']), 1)
