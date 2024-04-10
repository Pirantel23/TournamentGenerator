# models.py

from django.db import models

class Tournament(models.Model):
    TOURNAMENT_TYPES = [
        ('single', 'Single Elimination'),
        ('double', 'Double Elimination'),
    ]

    name = models.CharField(max_length=50)
    teams = models.TextField(help_text="Enter team names, separating each one with a new line")
    tournament_type = models.CharField(max_length=20, choices=TOURNAMENT_TYPES)

    def __str__(self):
        return self.name

class Match(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches')
    team1 = models.CharField(max_length=50)
    team2 = models.CharField(max_length=50, blank=True, null=True)
    winner = models.CharField(max_length=50, blank=True, null=True)
    round_number = models.PositiveIntegerField()
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

    def __str__(self):
        if self.winner:
            return f"{self.team1} vs {self.team2} (Winner: {self.winner})"
        else:
            return f"{self.team1} vs {self.team2}"