from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import UserRegisterSerializer, UserLoginSerializer
from django.contrib.auth import authenticate
from .models import User
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import redirect
from django.contrib.auth import logout
import json

def profile(request):
    """
    Renders the profile page.
    
    Args:
        request (HttpRequest): The HTTP request object.
    
    Returns:
        HttpResponse: The rendered profile page.
    """
    return render(request, 'profile.html')

def is_user_authenticated(request):
    """
    Checks if the user is authenticated.
    
    Args:
        request (HttpRequest): The HTTP request object.
    
    Returns:
        JsonResponse: A JSON response with user details if authenticated, otherwise an error message.
    """
    user = request.user
    if user.is_authenticated:
        response_data = {
            "id": user.id,
            "email": user.email,
            "isProf": user.is_prof,
            "firstName": user.first_name,
            "lastName": user.last_name
        }
        return JsonResponse(response_data)
    
    return JsonResponse({"error": "User not authenticated"}, status=401) 

@csrf_exempt
def customLogout(request):
    """
    Logs out the user and redirects to the home page.
    
    Args:
        request (HttpRequest): The HTTP request object.
    
    Returns:
        HttpResponseRedirect: A redirect to the home page.
    """
    logout(request)
    return redirect('/')

def custom_redirect_view(request):
    """
    Custom redirect view.
    
    Args:
        request (HttpRequest): The HTTP request object.
    
    Returns:
        HttpResponseRedirect: A redirect to the specified URL.
    """
    # Add your custom redirect logic here
    pass