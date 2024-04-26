# chat/consumers.py
import json
from django.contrib.auth import get_user_model
from channels.generic.websocket import AsyncWebsocketConsumer

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    participants = 0

    async def connect(self):
        self.room_group_name = 'main'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        self.participants += 1
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        self.participants -= 1

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        sender = self.scope["user"]
        sender_username = sender.username

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender": sender_username,
            },
        )

    async def chat_message(self, event):
        message = event["message"]
        sender = event["sender"]

        await self.send(
            text_data=json.dumps({"message": message, "sender": sender})
        )

    async def send_participant_count(self):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "participant_count",
                "count": self.participants,
            },
        )