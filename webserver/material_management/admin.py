from django.contrib import admin
from .models import CourseMaterial

@admin.register(CourseMaterial)
class CourseMaterialAdmin(admin.ModelAdmin):
    list_display = ('title', 'category')
    search_fields = ('title', 'category') 
