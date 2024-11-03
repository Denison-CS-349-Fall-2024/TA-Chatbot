from django.shortcuts import render, redirect, get_object_or_404
from .models import CourseMaterial, CourseMaterialForm

# Create (POST)
def post_material(request):
    if request.method == 'POST':
        form = CourseMaterialForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('get_materials')
    else:
        form = CourseMaterialForm()
    return render(request, 'post_material.html', {'form': form})

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
