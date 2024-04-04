# tournament/views.py

from django.shortcuts import render, redirect, get_object_or_404
from .forms import TournamentForm
from .models import Tournament, Match
import math
import random

def create_tournament(request):
    if request.method == 'POST':
        form = TournamentForm(request.POST)
        if form.is_valid():
            tournament_name = form.cleaned_data['tournament_name']
            teams_str = form.cleaned_data['teams']
            tournament_type = form.cleaned_data['tournament_type']
            teams = [team.strip() for team in teams_str.split('\n') if team]

            # Create Tournament instance
            tournament = Tournament.objects.create(name=tournament_name, tournament_type=tournament_type)

            n = len(teams)
            rounds_amount = math.ceil(math.log2(n))
            if n % 2 == 1:
                n+=1
            bracket = [[] for _ in range(rounds_amount)]
            for r in range(rounds_amount):
                n //= 2
                for _ in range(n):
                    bracket[r].append(Match.objects.create(tournament=tournament, round_number=r+1))

            random.shuffle(teams)
            for i, team in enumerate(teams):
                bracket[0][i//2].add_team(team)
            
            print(bracket)

            return redirect('/')
    else:
        form = TournamentForm()

    return render(request, 'tournament/create_tournament.html', {'form': form})

def tournament_info(request, tournament_id):
    tournament = get_object_or_404(Tournament, pk=tournament_id)
    return render(request, 'tournament/tournament_info.html', {'tournament': tournament})