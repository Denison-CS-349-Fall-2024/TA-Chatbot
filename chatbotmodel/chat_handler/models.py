from django.db import models

class ChatSession(models.Model):
    course_name = models.CharField(max_length=255)
    user_query = models.TextField()
    gpt_response = models.TextField()  # Storing GPT-4's response
    timestamp = models.DateTimeField(auto_now_add=True)  # Track when the chat occurred

    def __str__(self):
        return f"{self.course_name}: {self.user_query} at {self.timestamp}"
