# Generated by Django 4.2.8 on 2024-04-10 19:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournament', '0006_remove_tournament_teams_tournament_team_amount'),
    ]

    operations = [
        migrations.AddField(
            model_name='match',
            name='round_index',
            field=models.PositiveIntegerField(default=0),
            preserve_default=False,
        ),
    ]