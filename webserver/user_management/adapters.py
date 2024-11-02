from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.conf import settings
from urllib.parse import parse_qs

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

        user.name = data['first_name'] 
        return user
