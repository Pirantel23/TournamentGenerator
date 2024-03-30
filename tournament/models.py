# tournamet/models.py
from django.db import models

class Team(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Member(models.Model):
    name = models.CharField(max_length=100)
    team = models.ForeignKey(Team, related_name='members', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Tournament(models.Model):
    TOURNAMENT_TYPES = (
        ('single_elimination', 'Single Elimination'),
        ('double_elimination', 'Double Elimination'),
    )
    name = models.CharField(max_length=100)
    tournament_type = models.CharField(max_length=20, choices=TOURNAMENT_TYPES)

class Round(models.Model):
    tournament = models.ForeignKey(Tournament, related_name='rounds', on_delete=models.CASCADE)
    round_number = models.IntegerField()

class Match(models.Model):
    round = models.ForeignKey(Round, related_name='matches', on_delete=models.CASCADE)
    team1 = models.ForeignKey(Team, related_name='team1_matches', on_delete=models.CASCADE)
    team2 = models.ForeignKey(Team, related_name='team2_matches', on_delete=models.CASCADE)
    team1_score = models.PositiveIntegerField(default=0)
    team2_score = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Match: {self.team1.name} vs {self.team2.name}"
    
    def get_winner(self):
        if self.team1_score > self.team2_score:
            return self.team1
        elif self.team1_score < self.team2_score:
            return self.team2
        else:
            return None