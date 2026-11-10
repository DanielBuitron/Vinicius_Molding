from django.contrib import admin
from django.urls import include, path, re_path

from catalog.views import spa_index

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("catalog.urls")),
    path("api/", include("shop.urls")),
    path("api/whatsapp/", include("whatsapp.urls")),
    re_path(r"^.*$", spa_index, name="spa"),
]
