"""
ASGI config for fullstack_django project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter
from channels.routing import URLRouter

import os

from django.core.asgi import get_asgi_application
from django.urls import path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fullstack_django.settings')
from Consumers.consumer_2400 import Consumer_2400
from Consumers.consumer_433 import Consumer_433
from Consumers.consumer_5800 import Consumer_5800
from Consumers.consumerMulti import Consumer_Multi
django_asgi_app = get_asgi_application()
application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': AuthMiddlewareStack(
        URLRouter([
            path("con_5800", Consumer_5800.as_asgi()),
            path("con_2400", Consumer_2400.as_asgi()),
            path("con_433", Consumer_433.as_asgi()),
            path("con_multi", Consumer_Multi.as_asgi())
        ])
    )
})
# import subprocess
# from threading import Thread
# def enqueue_output():
#     try:
#         result = subprocess.run([".\chromium\chrome.exe", "--no-proxy-server", "--proxy-auto-detect", "http://127.0.0.1:3000", "--kiosk"], capture_output=True, text=True, check=True)
#     except subprocess.CalledProcessError as e:
#         print(f"Command failed with exit code {e.returncode}:")
#         print(e.output)

import urllib.request
frontIsReady = False 
while not frontIsReady:
    try:
        frontCode = urllib.request.urlopen("http://localhost:3000").getcode()
        if frontCode == 200: frontIsReady = True
    except: pass


# t = Thread(target=enqueue_output, args=())
# t.daemon =  True 
# t.start()
