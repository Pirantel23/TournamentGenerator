# main/urls.py
from django.urls import path
from django.views.generic import RedirectView
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('auth', views.handle_auth, name='auth'),
    path('logout', views.logout, name='logout'),
]