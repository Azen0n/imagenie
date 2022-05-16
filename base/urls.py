from django.urls import path

from base import views

urlpatterns = [
    path('', views.main_page, name='main_page'),
    path('binarization/', views.binarization, name='binarization'),
    path('gaussian/', views.gaussian, name='gaussian'),
    path('process_image/', views.process_image, name='process_image'),
]
