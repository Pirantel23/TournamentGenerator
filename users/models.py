from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    name = models.CharField(max_length=128, blank=True, null=True)
    email = models.EmailField(blank=False, null=False)
    picture_url = models.CharField(blank=True, null=True, max_length=256)
    password = models.CharField(max_length=128, blank=True, null=True)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        out = f'{self.name} - {self.email}'
        return out

    class Meta:
        unique_together = ('email',)