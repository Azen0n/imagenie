from django.urls import path

from base import views

urlpatterns = [
    path('', views.index, name='index'),
    path('binarization/', views.binarization, name='binarization'),
    path('gaussian/', views.gaussian, name='gaussian'),
    path('process_image/', views.process_image, name='process_image'),
]
