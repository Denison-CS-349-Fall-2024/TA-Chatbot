from django.db import models
from django.contrib.auth.models import UserManager, AbstractBaseUser, PermissionsMixin
from django.utils import timezone

class CustomerUserManager(UserManager):
    """
    Custom manager for handling user creation.
    """
    def _create_user(self, email, password, **extra_fields):
        """
        Create and save a user with the given email and password.
        
        Args:
            email (str): The email of the user.
            password (str): The password of the user.
            extra_fields (dict): Additional fields for the user.
        
        Returns:
            User: The created user object.
        
        Raises:
            ValueError: If no email is provided.
        """
        if not email:
            raise ValueError("You have not provided a valid email!")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, password=None, **extra_fields):
        """
        Create and save a regular user with the given email and password.
        
        Args:
            email (str): The email of the user.
            password (str): The password of the user.
            extra_fields (dict): Additional fields for the user.
        
        Returns:
            User: The created user object.
        """
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email=None, password=None, **extra_fields):
        """
        Create and save a superuser with the given email and password.
        
        Args:
            email (str): The email of the user.
            password (str): The password of the user.
            extra_fields (dict): Additional fields for the user.
        
        Returns:
            User: The created superuser object.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model.
    """
    username = None
    email = models.EmailField('email address', unique=True)
    first_name = models.CharField(max_length=255, blank=True, default='')
    last_name = models.CharField(max_length=255, blank=True, default='')
    is_prof = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    objects = CustomerUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email