from django.apps import AppConfig

class UserManagementConfig(AppConfig):
    """
    Configuration for the User Management app.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'user_management'