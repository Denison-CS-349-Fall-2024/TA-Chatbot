"""
URL configuration for webserver project.

This module defines the URL routing for the entire application:
- Admin interface routes
- Authentication endpoints
- API endpoints for different modules
- Static file serving

The `urlpatterns` list routes URLs to views. For more information see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/

URL Pattern Types:
    Function views:
        1. Import: from my_app import views
        2. Add URL: path('', views.home, name='home')
    Class-based views:
        1. Import: from other_app.views import Home
        2. Add URL: path('', Home.as_view(), name='home')
    Including another URLconf:
        1. Import: include() function
        2. Add URL: path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from user_management import views
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.http import JsonResponse
from django.shortcuts import redirect
from django.contrib.auth import logout
import os
from django.conf import settings

urlpatterns = [
    # Admin interface
    path('admin/', admin.site.urls),
    
    # Authentication routes
    path('accounts/', include('allauth.urls')),
    path('login/', lambda request: redirect('/accounts/login/')),  # Alias for login page

    # API endpoints for different modules
    path('api/chat/', include("chatbot_management.urls")),        # ChatBot functionality
    path('api/users/', include('user_management.urls')),          # User management
    path('api/materials/', include('material_management.urls')),  # Course materials
    path('class-management/', include('class_management.urls')),  # Class management
    path('student-management/', include('student_management.urls'))  # Student management
]

