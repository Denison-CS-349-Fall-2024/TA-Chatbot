from django.urls import path
from .views import UserRegisterView, UserLoginView, custom_redirect_view
from . import views


urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('is-authenticated/', views.is_user_authenticated, name='is_user_authenticated'),
    path("update-user-to-professor/", views.update_user_to_professor, name = "update_user_to_professor"),
    path('accounts/profile/', custom_redirect_view)
]
