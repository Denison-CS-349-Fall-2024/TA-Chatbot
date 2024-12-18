"""
User Management Tests
Tests user-related operations and views.

This module tests:
- User role updates
- User status checks
- Profile management
"""

from django.test import TestCase, Client
from django.urls import reverse
from .models import User
import json

class UserManagementTestCase(TestCase):
    def setUp(self):
        """Initialize test environment before each test."""
        self.client = Client()
        
        # Create test users
        self.student = User.objects.create_user(
            email="student@test.com",
            password="testpass123",
            first_name="Ada",
            last_name="Lovelace",
            is_prof=False
        )
        
        self.professor = User.objects.create_user(
            email="professor@test.com",
            password="testpass123",
            first_name="Alan",
            last_name="Turing",
            is_prof=True
        )

    def test_update_user_to_professor(self):
        """Test updating a user's role to professor."""
        data = {'email': self.student.email}
        response = self.client.patch(
            reverse('update_user_to_professor'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 201)
        updated_user = User.objects.get(email=self.student.email)
        self.assertTrue(updated_user.is_prof)
        self.assertTrue(updated_user.is_staff)

    def test_update_user_to_student(self):
        """Test updating a user's role to student."""
        data = {'email': self.professor.email}
        response = self.client.patch(
            reverse('update_user_to_student'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 201)
        updated_user = User.objects.get(email=self.professor.email)
        self.assertFalse(updated_user.is_prof)
        self.assertFalse(updated_user.is_staff)

    def test_update_nonexistent_user(self):
        """Test updating a non-existent user."""
        data = {'email': 'nonexistent@test.com'}
        response = self.client.patch(
            reverse('update_user_to_professor'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)

    def test_invalid_http_method(self):
        """Test using invalid HTTP method for role update."""
        data = {'email': self.student.email}
        response = self.client.post(
            reverse('update_user_to_professor'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 405)
