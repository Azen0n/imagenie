from django.urls import path

from base import views

urlpatterns = [
    path('', views.index, name='index'),
    path('process_image/', views.process_image, name='process_image'),
    path('articles/<int:id>', views.algorithm, name='algorithm'),
]
