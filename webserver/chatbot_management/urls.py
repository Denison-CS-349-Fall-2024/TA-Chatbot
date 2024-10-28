# urls for chatbot management
from django.contrib import admin
from django.urls import path
from .views import process_query

urlpatterns = [
    path('admin/', admin.site.urls),
    path('query/', process_query, name='query')
]