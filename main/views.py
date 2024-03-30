from django.http import HttpResponse
from django.shortcuts import render, redirect
from tournament.models import *


def index(request):
    return render(request, 'main/index.html', {'tournaments': Tournament.objects.all()})


def tournament_info(request):
    tournament_id = request.GET.get('tournament_id')
    if tournament_id:
        return redirect('tournament-info', tournament_id=tournament_id)
    else:
        return redirect('/')


def display_tournament(request, tournament_id):
    tournament = Tournament.objects.get(id=tournament_id)
    return render(request, 'main/tournament-info.html', {'tournament': tournament})