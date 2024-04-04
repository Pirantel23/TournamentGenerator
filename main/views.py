from django.shortcuts import render, redirect
from tournament.models import *


def index(request):
    return render(request, 'main/page.html', {'tournaments': Tournament.objects.all()})