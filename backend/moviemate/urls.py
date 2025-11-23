"""
URL configuration for moviemate project.
"""
from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from .views import api_root

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

