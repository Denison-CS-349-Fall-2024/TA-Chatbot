from django.db import models
from django.contrib.auth.models import UserManager, AbstractBaseUser, PermissionsMixin
from django.utils import timezone
# Create your models here.

"""
User Management Models
Defines the custom user model and its manager for the application.

This module provides:
- Custom user model extending Django's AbstractBaseUser
- Custom user manager for user creation
- User role management (student/professor)
"""

class CustomerUserManager(UserManager):
    """
    Custom user manager for creating users and superusers.
    
    Extends Django's UserManager to handle email-based authentication.
    """
    
    def _create_user(self, email, password, **extra_fields):
        """
        Base method for creating users.

        Args:
            email (str): User's email address
            password (str): User's password
            **extra_fields: Additional fields for user creation

        Returns:
            User: Created user instance

        Raises:
            ValueError: If email is not provided
        """
        if not email:
            raise ValueError("You have not provided a valid email!")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self.db)
        return user
    
    def create_user(self, email=None, password=None, **extra_fields):
        """
        Creates and saves a regular user.

        Args:
            email (str): User's email address
            password (str): User's password
            **extra_fields: Additional fields for user creation

        Returns:
            User: Created regular user instance
        """
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)
    
    def create_superuser(self, email=None, password=None, **extra_fields):
        """
        Creates and saves a superuser.

        Args:
            email (str): Superuser's email address
            password (str): Superuser's password
            **extra_fields: Additional fields for superuser creation

        Returns:
            User: Created superuser instance
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model using email as the unique identifier.
    
    Attributes:
        email (EmailField): User's email address (unique)
        first_name (CharField): User's first name
        last_name (CharField): User's last name
        is_prof (BooleanField): Professor status flag
        is_staff (BooleanField): Staff status flag
        is_superuser (BooleanField): Superuser status flag
        date_joined (DateTimeField): Account creation date
        last_login (DateTimeField): Last login timestamp
        is_active (BooleanField): Active status flag
    """
    username = None
    email = models.EmailField('email adress', unique=True)
    first_name = models.CharField(max_length=255, blank=True, default='')
    last_name = models.CharField(max_length=255, blank=True, default='')
    is_prof = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    objects = CustomerUserManager()

    USERNAME_FIELD = "email"
    EMAIL = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        """
        Meta class for User model.
        """
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def get_full_name(self):
        """
        Returns the user's full name.

        Returns:
            str: User's full name (first_name + last_name)
        """
        return f"{self.first_name} {self.last_name}"