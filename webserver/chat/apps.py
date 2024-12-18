from django.apps import AppConfig

class ChatConfig(AppConfig):
    """
    Configuration for the Chat app.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'chat'