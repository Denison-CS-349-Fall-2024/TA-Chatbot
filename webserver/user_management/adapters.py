from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    
    def populate_user(self, request, sociallogin, data):
        userType = request.COOKIES.get('userType')

        # Call the original populate_user to maintain normal behavior
        user = super().populate_user(request, sociallogin, data)

        # Optionally set fields based on the decoded user type
        if userType == 'instructor':
            user.is_prof = True
            user.is_staff = True
        else:
            user.is_prof = False
            user.is_staff = False

        user.first_name = data['first_name'] 
        user.last_name = data['last_name']
        return user

    def pre_social_login(self, request, sociallogin):
        """
        This method is called after a successful social login but before the user is signed in.
        If an existing user with the same email exists, link the social account to that user.
        """
        # Ensure the user is not already authenticated
        if request.user.is_authenticated:
            return

        # Get the email from the social login's extra data
        email = sociallogin.account.extra_data.get('email')
        if not email:
            return  # If email is missing, we can't proceed

        # Try to find an existing user with the same email
        try:
            existing_user = User.objects.get(email=email)
            # Link the social account to the existing user
            sociallogin.connect(request, existing_user)
        except User.DoesNotExist:
            # No user found; allow Allauth to handle signup
            pass
