from dotenv import load_dotenv
import os

if not load_dotenv():
    raise Exception('No .env file found')


CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
SERVER_IP = os.getenv('SERVER_IP')
SERVER_DOMAIN = os.getenv('SERVER_DOMAIN')
DJANGO_SECRET = os.getenv('DJANGO_SECRET')
REDIRECT_URI = f'https://{SERVER_DOMAIN}/auth'