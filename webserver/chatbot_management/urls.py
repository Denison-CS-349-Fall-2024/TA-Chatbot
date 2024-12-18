"""
ChatBot Management URL Configuration

This module defines URL patterns for AI chat functionality:
- Query processing endpoints
- Chat session management
- Admin interface routes

Each path maps to a specific view function that handles chat-related operations.
The module integrates with OpenAI's GPT models and Pinecone for vector search.
"""

from django.contrib import admin
from django.urls import path
from .views import process_query

urlpatterns = [
    # Admin interface access
    path('admin/', admin.site.urls),
    
    # Chat query processing endpoint
    path('query/', process_query, name='query')
]