# chat/views.py
from django.shortcuts import render
from .models import Message
from django.http import JsonResponse
import time
import json
import datetime

RATE_LIMIT = 2
UPDATE_RATE = 5
TIMEOUT = 30

active_long_poll_requests = {}

class LongPollThread():
    def __init__(self, client_id, sender, last_message_id, room):
        self.client_id = client_id
        self.sender = sender
        self.last_message_id = last_message_id
        self.room = room
        self.stop_event = False

    def run(self) -> JsonResponse:
        request_time = time.time()
        flag = True
        while 1:
            if flag:
                time.sleep(RATE_LIMIT)
                flag = False
                continue
            current = time.time()
            if current - request_time > TIMEOUT:
                self.log(f"Long poll request from {self.client_id} timed out.")
                return JsonResponse({'error': 'Request timed out.'})

            if self.stop_event:
                self.log(f"Long poll request from {self.client_id} stopped.")
                return JsonResponse({'error': 'Request stopped.'}, status=400)
            self.log(f'{self.sender} is checking db')
            new_messages = Message.objects.filter(id__gt=self.last_message_id, room=self.room).exclude(sender=self.sender)
            if new_messages:
                messages_data = [{'id': msg.id, 'sender': msg.sender.username, 'content': msg.content, 'room': msg.room, 'timestamp': msg.timestamp, 'type': msg.type} for msg in new_messages]
                self.log(f"Long poll request from {self.client_id} returned {len(messages_data)} new messages in {time.time() - request_time}s")
                active_long_poll_requests.pop(self.client_id)
                return JsonResponse(messages_data, safe=False)
            else:
                time.sleep(UPDATE_RATE)

    def stop(self):
        self.stop_event = True

    def log(self, message):
        now = datetime.datetime.now()
        open('log.txt', 'a').write(f'[{now}] {message}\n')

def send_message(request):
    if request.method != 'POST':
        return JsonResponse({'success': False})
    
    sender = request.user
    data = json.loads(request.body)
    room = data.get('room')
    content = data.get('content')
    type = data.get('type')

    if not room or not content:
        return JsonResponse({'success': False})

    message = Message.objects.create(sender=sender, room=room, content=content, type=type)

    return JsonResponse({'success': True, 'last_message_id': message.id, 'sender': sender.username, 'content': content, 'timestamp': message.timestamp, 'room': room, 'type': type})

def long_poll_messages(request):
    now = datetime.datetime.now()
    open('log.txt', 'a').write(f'[{now}] ACTIVE:{active_long_poll_requests}.\n')
    if request.method != 'POST':
        return JsonResponse({'error': 'POST request required.'}, status=400)
    sender = request.user
    client_id = sender.id
    open('log.txt', 'a').write(f'[{now}] Long poll request received from {sender}.\n')
    data = json.loads(request.body)
    last_message_id = data.get('last_message_id')
    room = data.get('room')
    

    existing_thread = active_long_poll_requests.get(client_id)
    open('log.txt', 'a').write(f'[{now}] EXISTING {client_id}:{active_long_poll_requests}.\n')
    if existing_thread:
        open('log.txt', 'a').write(f'[{now}] Deleting thread from {sender}.\n')
        existing_thread.stop()
        del active_long_poll_requests[client_id]

    if not last_message_id:
        last_message_id = Message.objects.last().id

    thread = LongPollThread(client_id, sender, last_message_id, room)
    active_long_poll_requests[client_id] = thread
    return thread.run()