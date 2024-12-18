from django.test import TestCase, Client
from django.urls import reverse
from .models import ChatSession
from class_management.models import Course
from user_management.models import User
import json

class ChatBotManagementTestCase(TestCase):
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

    def test_process_query(self):
        """Test chat query processing."""
        query_data = {
            'class_id': str(self.course.id),
            'query': 'What are the course prerequisites?'
        }
        
        response = self.client.post(
            reverse('query'),
            data=json.dumps(query_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertTrue('response' in data)

    def test_chat_session_creation(self):
        """Test chat session recording."""
        session = ChatSession.objects.create(
            course_name=self.course.name,
            user_query="Test question?",
            gpt_response="Test response."
        )
        
        self.assertEqual(session.course_name, self.course.name)
        self.assertEqual(session.user_query, "Test question?")
        self.assertEqual(session.gpt_response, "Test response.")
