from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import UserRegisterSerializer, UserLoginSerializer
from django.contrib.auth import authenticate
from .models import User
from django.shortcuts import render


def profile(request):
    return render(request, 'profile.html')

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
