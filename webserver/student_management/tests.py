from django.test import TestCase, Client
from django.urls import reverse
from .models import StudentEnrollments
from user_management.models import User
from class_management.models import Course
import json

class StudentEnrollmentTestCase(TestCase):
    def setUp(self):
        """Initialize test environment before each test."""
        self.client = Client()
        
        # Create test student
        self.student = User.objects.create_user(
            email="student@test.com",
            password="testpass123",
            first_name="Ada",
            last_name="Lovelace",
            is_prof=False
        )
        
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

    def test_create_enrollment(self):
        """Test enrollment creation."""
        data = {
            'student_id': str(self.student.id),
            'course_id': str(self.course.id)
        }
        
        response = self.client.post(
            reverse('create_enrollment'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertTrue(StudentEnrollments.objects.filter(
            student=self.student,
            course=self.course
        ).exists())

    def test_get_enrollments_by_course(self):
        """Test retrieving enrollments for a course."""
        # Create an enrollment first
        enrollment = StudentEnrollments.objects.create(
            student=self.student,
            course=self.course
        )
        
        response = self.client.get(
            reverse('get_enrollments_by_course', args=[self.course.id])
        )
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(len(data['enrollments']), 1)
        self.assertEqual(data['enrollments'][0]['student']['email'], self.student.email)

    def test_get_enrollments_by_student(self):
        """Test retrieving enrollments for a student."""
        # Create an enrollment first
        enrollment = StudentEnrollments.objects.create(
            student=self.student,
            course=self.course
        )
        
        response = self.client.get(
            reverse('get_enrollments_by_student', args=[self.student.id])
        )
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(len(data['enrollments']), 1)

    def test_duplicate_enrollment(self):
        """Test attempting to create duplicate enrollment."""
        # Create initial enrollment
        StudentEnrollments.objects.create(
            student=self.student,
            course=self.course
        )
        
        # Attempt to create duplicate enrollment
        data = {
            'student_id': str(self.student.id),
            'course_id': str(self.course.id)
        }
        
        response = self.client.post(
            reverse('create_enrollment'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 409)  # Conflict status code
