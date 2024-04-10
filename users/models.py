from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    username = models.CharField(max_length=128, blank=True, null=True, unique=True)
    email = models.EmailField(blank=False, null=False)
    picture_url = models.CharField(blank=True, null=True, max_length=256)
    password = models.CharField(max_length=128, blank=True, null=True)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        out = f'{self.username} - {self.email}'
        return out