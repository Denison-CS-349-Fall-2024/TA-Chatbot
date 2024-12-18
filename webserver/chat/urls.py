from django.urls import path
from . import views

# URL patterns for the chat app
urlpatterns = [
    path("getchats/", views.index, name="index"),
]