from django.urls import path

from . import views

urlpatterns = [
    path("shop/ping", views.ping),
]
