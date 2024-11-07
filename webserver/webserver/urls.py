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

import os
from django.conf import settings

def getuser(request):
    # redirect_url = f"http://localhost:4200?session_token={ request.session.session_key }"
    # return redirect(redirect_url)
    user = request.user
    if user.is_authenticated:
        response_data = {
            "email": user.email,
            "isProf": user.is_prof,
            "name": user.name
        }
        return JsonResponse(response_data)
    
    return JsonResponse({"error": "User not authenticated"}, status=401)  # Handle the case where user is not authenticated

@csrf_exempt
def upload_file(request):

    if request.method == 'POST' and request.FILES.get('file'):
        file = request.FILES['file']
        file_name = request.POST.get('fileName', file.name)  # Fallback to original name if not provided
        material_type = request.POST.get('materialType') 

        file_path = os.path.join(settings.MEDIA_ROOT, file_name)

        # Save the file to the 'uploads' directory
        with open(file_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        

        return JsonResponse({'message': 'File uploaded successfully', 'fileName': file_name})

    return JsonResponse({'error': 'File not uploaded'}, status=400)



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/chat/',include("chatbot_management.urls")),
    path('accounts/', include('allauth.urls')),
    path('accounts/profile/', views.profile, name="profile"),
    path("getuser/", getuser, name="getuser"),
    path('api/users/', include('user_management.urls')),  # Include user management URLs
    path('api/materials/', include('material_management.urls')),  # Include user management URLs
    path('class_management/', include('class_management.urls')),

    path("upload-material/", upload_file, name="upload_file")
]
