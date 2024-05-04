from django.db import models
from users.models import User

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    room = models.CharField(max_length=10)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=10, default='message')

    def __str__(self):
        return f"{self.content} by {self.sender} in {self.room} at {self.timestamp}"