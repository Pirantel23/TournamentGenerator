# Generated by Django 4.2.8 on 2024-05-04 11:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='type',
            field=models.CharField(default='message', max_length=10),
        ),
    ]
