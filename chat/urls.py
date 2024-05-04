# chat/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path("send/", views.send_message, name="send_message"),
    path("get/", views.long_poll_messages, name="get_messages"),
]