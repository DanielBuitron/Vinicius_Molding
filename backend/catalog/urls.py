from django.urls import path

from . import views

urlpatterns = [
    path("health", views.health),
    path("products", views.products),
    path("config", views.config),
]
