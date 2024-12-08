"""
URL configuration for webserver project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
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
    path('admin/', admin.site.urls),
    path('api/accounts/', include('allauth.urls')),
    
    # Alias `/login/` to the Allauth login page
    path('login/', lambda request: redirect('/accounts/login/')),

    path('api/chat/', include("chatbot_management.urls")),
    path('api/users/', include('user_management.urls')),
    path('api/materials/', include('material_management.urls')),
    path('api/class-management/', include('class_management.urls')),
    path('api/student-management/', include('student_management.urls'))
]

