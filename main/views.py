from django.shortcuts import render, redirect
from tournament.models import *
from urllib.parse import parse_qs, urlparse
import jwt
import requests
from users.models import User
from django.contrib.auth import login
from config import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI


def index(request):
    username = request.session.get('username') or ''
    picture = request.session.get('picture') or '/static/user-avatar.svg'
    is_admin = request.session.get('is_admin') or False
    logged_in = request.session.get('logged_in') or False
    return render(request, 'main/index.html', {'tournaments': Tournament.objects.all(), 
                                              'client_id': CLIENT_ID, 
                                              'redirect_uri': REDIRECT_URI,
                                              'username': username,
                                              'picture': picture,
                                              'is_admin': is_admin,
                                              'logged_in': logged_in})


def logout(request):
    request.session.flush()
    return redirect('/')



def handle_auth(request):
    code = parse_qs(urlparse(request.get_full_path()).query)['code'][0]
    data = get_user_information(code)
    decoded = jwt.decode(data['id_token'], '', algorithms='none', options={'verify_signature': False})
    email = decoded['email']
    name = decoded['name']
    picture = decoded['picture']
    user, _ = User.objects.get_or_create(username=name,
                                                  email=email,
                                                  picture_url=picture)
    request.session['username'] = user.username
    request.session['picture'] = user.picture_url
    request.session['is_admin'] = user.is_admin
    request.session['logged_in'] = user.is_authenticated

    login(request, user, backend='django.contrib.auth.backends.ModelBackend')
    return redirect('/')


def get_user_information(code):
    request = requests.post('https://oauth2.googleapis.com/token',
                            data={
                                'code': code,
                                'client_id': CLIENT_ID,
                                'client_secret': CLIENT_SECRET,
                                'redirect_uri': REDIRECT_URI,
                                'grant_type': 'authorization_code',
                            })
    return request.json()