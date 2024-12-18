from rest_framework import serializers
from .models import User

class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    class Meta:
        model = User
        fields = ['email', 'password', 'name', 'is_prof']

    def create(self, validated_data):
        """
        Create a new user with the provided validated data.
        
        Args:
            validated_data (dict): The validated data for creating a user.
        
        Returns:
            User: The created user object.
        """
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data.get('name', ''),
            is_prof=validated_data.get('is_prof', False)
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    """
    email = serializers.EmailField()
    password = serializers.CharField()