from django.urls import path

from base import views

urlpatterns = [
    path('', views.index, name='index'),
    path('articles/process_image/', views.process_image, name='process_image'),
    path('articles/<int:id>', views.algorithm, name='algorithm'),
    path('articles/<int:id>/tests', views.tests, name='tests'),
    path('articles/<int:article_id>/tests/<int:test_id>', views.test, name='test'),
    path('articles/<int:article_id>/tests/<int:test_id>/get_test_results/', views.get_test_results, name='get_test_results'),
    path('search', views.search_results, name='search')
]
