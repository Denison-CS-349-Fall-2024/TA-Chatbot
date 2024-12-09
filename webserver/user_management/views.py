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

def profile(request):
    return render(request, 'profile.html')

def is_user_authenticated(request):

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
    logout(request)
    return redirect('/')

def custom_redirect_view(request):
    return redirect('http://127.0.0.1:4200/')  # Your Angular landing page

@csrf_exempt
def update_user_to_professor(request):
    if request.method == 'PATCH':
        try:
            data = json.loads(request.body)
            email = data.get('email')

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
    if request.method == 'PATCH':
        try:
            data = json.loads(request.body)
            email = data.get('email')

            user = User.objects.get(email=email)
            
            user.is_prof = False
            user.is_staff = False
            
            user.save()

            return JsonResponse({'message': f'{email} is now a student'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user = authenticate(request, email=email, password=password)
        
        if user is not None:
            # You may want to create a token or session here
            return Response({"message": "Login successful!"}, status=status.HTTP_200_OK)
        return Response({"error": f"Invalid email or password. email is {email} and password is {password}"}, status=status.HTTP_401_UNAUTHORIZED)
