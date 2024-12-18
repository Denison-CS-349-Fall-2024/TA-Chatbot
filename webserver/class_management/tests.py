from django.test import TestCase, Client
from django.urls import reverse
from .models import Course

class CourseViewsTestCase(TestCase):
    """
    Test case for the course views.
    """
    
    def setUp(self):
        """
        Set up the test client and initial data.
        """
        self.client = Client()

        # Test data for creating a course
        self.test_course_data = {
            'name': 'Data Science Basics',
            'pin': 'AB1234',
            'section': 'A',
            'professor_id': 'Prof. Alan Turing'  # This can be an ID of a user if connected to actual User model
        }

        # Create an initial course to test deletion
        self.existing_course = Course.objects.create(
            name="Python for Beginners",
            pin="XYZ5678",
            section='A',
            professor="Prof. John Doe"
        )

    def test_create_course(self):
        """
        Test creating a course through the create_course view.
        """
        response = self.client.post(
            reverse('create_course'),  # Ensure this URL name matches your URL configuration
            data=self.test_course_data,
            content_type='application/json'
        )
        
        # Check if the response status code is 201 (Created)
        self.assertEqual(response.status_code, 201)

        # Check if the course was created in the database
        created_course = Course.objects.get(name='Data Science Basics')
        self.assertIsNotNone(created_course)