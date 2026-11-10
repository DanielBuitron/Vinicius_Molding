from django.urls import path

from . import views

urlpatterns = [
    path("bridge/inbound", views.bridge_inbound),
]
