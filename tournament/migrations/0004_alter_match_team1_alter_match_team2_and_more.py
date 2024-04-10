# Generated by Django 4.2.8 on 2024-04-10 14:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournament', '0003_remove_round_tournament_remove_match_round_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='match',
            name='team1',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='match',
            name='team2',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='match',
            name='winner',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='tournament',
            name='name',
            field=models.CharField(max_length=50),
        ),
    ]
