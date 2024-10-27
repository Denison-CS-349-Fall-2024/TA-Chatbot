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
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.shortcuts import redirect


def getuser(request):
    # redirect_url = f"http://localhost:4200?session_token={ request.session.session_key }"
    # return redirect(redirect_url)
    user = request.user
    if user.is_authenticated:
        response_data = {
            "user": user.email,
        }
        return JsonResponse(response_data)
    
    return JsonResponse({"error": "User not authenticated"}, status=401)  # Handle the case where user is not authenticated

urlpatterns = [
    path("api/chat/", include("chat.urls")),
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('accounts/profile/', views.profile, name="profile"),
    path("getuser/", getuser, name="getuser"),
    path('api/users/', include('user_management.urls')),  # Include user management URLs
    path('class_management/', include('class_management.urls'))
]
