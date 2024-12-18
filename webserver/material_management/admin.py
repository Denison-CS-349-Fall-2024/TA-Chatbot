from django.contrib import admin
from .models import CourseMaterial

@admin.register(CourseMaterial)
class CourseMaterialAdmin(admin.ModelAdmin):
    """
    Admin configuration for the CourseMaterial model.
    """
    list_display = ('title', 'category')
    search_fields = ('title', 'category')