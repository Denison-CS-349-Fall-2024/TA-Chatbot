from django.shortcuts import render, redirect, get_object_or_404
from .models import CourseMaterial, CourseMaterialForm
from class_management.models import Course
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt
import os
from django.conf import settings

# Create (POST)
@csrf_exempt
def post_material(request):

    if request.method == 'POST' and request.FILES.get('file'):
        file = request.FILES['file']
        file_name = request.POST.get('fileName', file.name)  # Fallback to original name if not provided
        material_type = request.POST.get('materialType') 

        file_path = os.path.join(settings.MEDIA_ROOT, file_name)

        # Save the file to the 'uploads' directory
        with open(file_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        
        course = Course.objects.get_course("3")
        CourseMaterial.objects.create_material(title = file_name, category = material_type, course = course)

        return JsonResponse({'message': 'File uploaded successfully', 'fileName': file_name})

    return JsonResponse({'error': 'File not uploaded'}, status=400)

# Read (GET)
def get_materials(request):
    materials = CourseMaterial.objects.all()
    return render(request, 'get_materials.html', {'materials': materials})

def get_material(request, title):
    material = CourseMaterial.objects.filter(title=title)
    return render(request, 'get_material.html', {'material': material})

# Update (PUT)
def put_material(request, title):
    material = get_object_or_404(CourseMaterial, title=title)
    if request.method == 'POST':
        form = CourseMaterialForm(request.POST, request.FILES, instance=material)
        if form.is_valid():
            form.save()
            return redirect('get_materials')
    else:
        form = CourseMaterialForm(instance=material)
    return render(request, 'put_material.html', {'form': form, 'material': material})

# Delete (DELETE)
def delete_material(request, title):
    material = get_object_or_404(CourseMaterial, title=title)
    if request.method == 'POST':
        material.delete()
        return redirect('get_materials')
    return render(request, 'confirm_delete.html', {'material': material})
