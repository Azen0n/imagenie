from django.urls import path

from base import views

urlpatterns = [
    path('', views.index, name='index'),
    path('binarization/', views.process_image, name='binarization')
]
