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
from django.shortcuts import redirect

"""
User Management Views
Handles user authentication, registration, and profile management.

This module manages:
- User registration and authentication
- Profile updates and queries
- Role management (student/professor)
- Session handling
"""

def profile(request):
    """
    Renders the user profile page.

    Args:
        request: HTTP request

    Returns:
        Rendered profile template
    """
    return render(request, 'profile.html')

def is_user_authenticated(request):
    """
    Checks if current user is authenticated and returns user details.

    Args:
        request: HTTP request

    Returns:
        JsonResponse: User authentication status and details if authenticated
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
    Logs out the current user and redirects to home page.

    Args:
        request: HTTP request

    Returns:
        Redirect: Redirects to home page after logout
    """
    logout(request)
    return redirect('/')

def custom_redirect_view(request):
    """
    Redirects to Angular frontend landing page.

    Args:
        request: HTTP request

    Returns:
        Redirect: Redirects to Angular frontend
    """
    return redirect('http://127.0.0.1:4200/')

@csrf_exempt
def update_user_to_professor(request):
    """
    Updates a user's role to professor.

    Args:
        request: HTTP request containing user email

    Returns:
        JsonResponse: Status of role update
    """
    if request.method == 'PATCH':
        try:
            # Extract user data from request
            data = json.loads(request.body)
            email = data.get('email')

            # Get user object and update roles
            user = User.objects.get(email=email)
            user.is_prof = True
            user.is_staff = True
            user.save()

            return JsonResponse({'message': f'{email} is now a professor'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

@csrf_exempt
def update_user_to_student(request):
    """
    Updates a user's role to student.

    Args:
        request: HTTP request containing user email

    Returns:
        JsonResponse: Status of role update
    """
    if request.method == 'PATCH':
        try:
            # Extract user data from request
            data = json.loads(request.body)
            email = data.get('email')

            # Get user object and update roles
            user = User.objects.get(email=email)
            user.is_prof = False
            user.is_staff = False
            user.save()

            return JsonResponse({'message': f'{email} is now a student'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

class UserRegisterView(generics.CreateAPIView):
    """
    Handles user registration process.
    
    Attributes:
        queryset: All user objects
        serializer_class: UserRegisterSerializer for data validation
        permission_classes: AllowAny to permit registration
    """
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

class UserLoginView(generics.GenericAPIView):
    """
    Handles user login process.

    Attributes:
        serializer_class: UserLoginSerializer for data validation
        permission_classes: AllowAny to permit login attempts
    """
    serializer_class = UserLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        """
        Processes login request.

        Args:
            request: HTTP request containing login credentials
            *args: Variable length argument list
            **kwargs: Arbitrary keyword arguments

        Returns:
            Response: Login status and message
        """
        # Validate request data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        # Authenticate user
        user = authenticate(request, email=email, password=password)
        
        if user is not None:
            return Response({"message": "Login successful!"}, status=status.HTTP_200_OK)
        return Response({"error": f"Invalid email or password. email is {email} and password is {password}"}, 
                       status=status.HTTP_401_UNAUTHORIZED)
