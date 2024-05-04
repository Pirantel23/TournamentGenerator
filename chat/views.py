# chat/views.py
from django.shortcuts import render
from .models import Message
from django.http import JsonResponse
import time
import json


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
    if request.method != 'POST':
        return JsonResponse({'error': 'POST request required.'}, status=400)
    print(f'Long poll request received from {request.user}.')
    request_time = time.time()
    sender = request.user
    data = json.loads(request.body)
    last_message_id = data.get('last_message_id')
    room = data.get('room')
    if not last_message_id:
        last_message_id = Message.objects.last().id

    while True:
        new_messages = Message.objects.filter(id__gt=last_message_id, room=room).exclude(sender=sender)
        if new_messages:
            messages_data = [{'id': msg.id, 'sender': msg.sender.username, 'content': msg.content, 'room': msg.room, 'timestamp': msg.timestamp, 'type': msg.type} for msg in new_messages]
            print(f'Long poll response sent to {request.user} in {time.time() - request_time:.2f}s')
            return JsonResponse(messages_data, safe=False)
        else:
            time.sleep(1)