from django.apps import AppConfig

class StudentManagementConfig(AppConfig):
    """
    Configuration for the Student Management app.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'student_management'