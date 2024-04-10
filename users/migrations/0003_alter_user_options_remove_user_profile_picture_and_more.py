# Generated by Django 4.2.8 on 2024-04-10 11:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_user_name_alter_user_first_name_alter_user_last_name'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={},
        ),
        migrations.RemoveField(
            model_name='user',
            name='profile_picture',
        ),
        migrations.AddField(
            model_name='user',
            name='is_admin',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='picture_url',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
    ]