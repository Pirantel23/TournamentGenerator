# main/urls.py
from django.urls import path
from django.views.generic import RedirectView
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('tournament-info/', views.tournament_info, name='tournament-info'),
    path('tournament-info/<int:tournament_id>/', views.display_tournament, name='tournament-info'),
]