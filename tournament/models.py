# models.py

from django.db import models
from users.models import User

class Tournament(models.Model):
    TOURNAMENT_TYPES = [
        ('single', 'Single Elimination'),
        ('double', 'Double Elimination'),
    ]

    name = models.CharField(max_length=50)
    team_amount = models.PositiveIntegerField(default=0)
    author = models.ForeignKey(User, related_name='tournaments', on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now_add=True)
    tournament_type = models.CharField(max_length=20, choices=TOURNAMENT_TYPES)

    def __str__(self):
        return self.name
        
    
    def get_formatted_date(self):
        return self.creation_date.strftime("%d.%m.%Y %H:%M")
    

class Match(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches')
    team1 = models.CharField(max_length=50, blank=True, null=True)
    team2 = models.CharField(max_length=50, blank=True, null=True)
    score1 = models.PositiveIntegerField(default=0)
    score2 = models.PositiveIntegerField(default=0)
    winner = models.CharField(max_length=50, blank=True, null=True)
    round_number = models.PositiveIntegerField()
    round_index = models.PositiveIntegerField()
    is_final = models.BooleanField(default=False)

    def add_team(self, team_name):
        if not self.team1:
            self.team1 = team_name
            self.save()
        elif not self.team2:
            self.team2 = team_name
            self.save()
        else:
            raise Exception("Both teams are already assigned for this match")

    def advance_winner(self, team_number):
        if team_number == 1:
            self.winner = self.team1
        elif team_number == 2:
            self.winner = self.team2
        else:
            raise Exception("Invalid team number")
        self.save()
        if self.is_final:
            return False
        next_match = Match.objects.get(tournament=self.tournament, round_number=self.round_number+1, round_index=self.round_index//2)
        next_match.add_team(self.winner)
        return True

    def __str__(self):
        if self.winner:
            return f"{self.team1} vs {self.team2} (Winner: {self.winner})"
        else:
            return f"{self.team1} vs {self.team2}"