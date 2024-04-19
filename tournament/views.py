# tournament/views.py

import json
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from .models import Tournament, Match
import math
import random
from datetime import datetime


def create_tournament(request):
    if not request.session.get('logged_in'):
        return redirect('/')
    if request.method == 'POST':
        data = request.POST
        tournament_name = data['tournament_name']
        teams_str = data['teams']
        tournament_type = data['tournament_type']
        date = datetime.strptime(data['tournament_datetime'], "%Y-%m-%dT%H:%M")
        
        teams = list({team.strip() for team in teams_str.split('\n') if team.strip()})
        print(tournament_name, tournament_type, date, teams)
        tournament = Tournament.objects.create(name=tournament_name,
                                               tournament_type=tournament_type,
                                               author=request.user,
                                               team_amount=len(teams),
                                               date=date)
        n = len(teams)
        rounds_amount = math.ceil(math.log2(n))
        max_teams = 2 ** rounds_amount
        random.shuffle(teams)
        for i in range(max_teams - n):
            teams.insert(2 * i + 1, '-')
        
        bracket = [[] for _ in range(rounds_amount)]
        for r in range(rounds_amount):
            max_teams //= 2
            for i in range(max_teams):
                bracket[r].append(Match.objects.create(tournament=tournament, round_number=r+1, round_index=i))
        bracket[-1][0].is_final = True
        bracket[-1][0].save()
        for i, team in enumerate(teams):
            bracket[0][i//2].add_team(team)
        # Advancing bye teams
        for match in bracket[0]:
            if match.team2 == '-':
                match.finish(1, 0)
        
        print(bracket)
        return redirect('/')

    return render(request, 'tournament/create_tournament.html', {'form': form})

def tournament_info(request, tournament_id):
    tournament = get_object_or_404(Tournament, pk=tournament_id)
    return render(request, 'tournament/tournament_info.html', {'tournament': tournament})

def edit_match(request, match_id):
    data = json.loads(request.body)
    score1 = data.get('score1')
    score2 = data.get('score2')
    match = get_object_or_404(Match, pk=match_id)
    if not request.session.get('is_admin') and request.user != match.tournament.author:
        return JsonResponse({'success': False})
    next_match = match.finish(score1, score2)
    if next_match:
        if match.is_final:
            next_match_id = None
            team1 = None
            team2 = None
        else:
            next_match_id = next_match.id
            team1 = next_match.team1
            team2 = next_match.team2
        return JsonResponse({'success': True,
                             'next_match_id': next_match_id,
                             'team1': team1,
                             'team2': team2 ,
                             'score1': score1,
                             'score2': score2})
    return JsonResponse({'success': False})


def delete_tournament(request, tournament_id):
    try:
        tournament = Tournament.objects.get(pk=tournament_id)
        if not request.session.get('is_admin') and request.user != tournament.author:
            return JsonResponse({'success': False})
        tournament.delete()
        return JsonResponse({'success': True})
    except Tournament.DoesNotExist:
        return JsonResponse({'success': False})