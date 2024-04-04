# tournament/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_tournament, name='create_tournament'),
    path('display/<int:tournament_id>/', views.tournament_info, name='tournament_info'),
]