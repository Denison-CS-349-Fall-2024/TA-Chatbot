from django.urls import path

from . import views

urlpatterns = [
    path("getchats/", views.index, name="index"),
]