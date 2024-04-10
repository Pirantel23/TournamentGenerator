# tournament/views.py

from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from .forms import TournamentForm
from .models import Tournament, Match
import math
import random



def create_tournament(request):
    if not request.session.get('logged_in'):
        return redirect('/')
    if request.method == 'POST':
        form = TournamentForm(request.POST)
        if form.is_valid():
            tournament_name = form.cleaned_data['tournament_name']
            teams_str = form.cleaned_data['teams']
            tournament_type = form.cleaned_data['tournament_type']
            teams = list({team.strip() for team in teams_str.split('\n') if team.strip()})

            # Create Tournament instance
            tournament = Tournament.objects.create(name=tournament_name,
                                                   tournament_type=tournament_type,
                                                   author=request.user,
                                                   team_amount=len(teams))

            n = len(teams)
            rounds_amount = math.ceil(math.log2(n))
            max_teams = 2 ** rounds_amount

            random.shuffle(teams)
            for i in range(max_teams - n):
                teams.insert(2 * i + 1, 'BYE')
            
            bracket = [[] for _ in range(rounds_amount)]
            for r in range(rounds_amount):
                max_teams //= 2
                for _ in range(max_teams):
                    bracket[r].append(Match.objects.create(tournament=tournament, round_number=r+1))
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


def delete_tournament(request, tournament_id):
    try:
        tournament = Tournament.objects.get(pk=tournament_id)
        tournament.delete()
        return JsonResponse({'success': True})
    except Tournament.DoesNotExist:
        return JsonResponse({'success': False})