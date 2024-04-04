# tournament/forms.py

from django import forms

class TournamentForm(forms.Form):
    tournament_name = forms.CharField(max_length=100)
    teams = forms.CharField(widget=forms.Textarea, help_text="Enter team names, separating each one with a new line")
    tournament_type = forms.ChoiceField(choices=[('single', 'Single Elimination'), ('double', 'Double Elimination')])