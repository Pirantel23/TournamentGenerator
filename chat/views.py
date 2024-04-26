# chat/views.py
from django.shortcuts import render


def index(request):
    return render(request, "chat/room.html", {"room_name": 'main'})