from django.urls import path
from django.views.generic import TemplateView

from . import views


urlpatterns = [
    path("", views.home, name="home"),
    path(
        "assistant/",
        views.assistant,
        name="assistant",
    ),
    path(
        "rent/",
        views.rent,
        name="rent",
    ),
    path(
        "sell/",
        views.sell,
        name="sell",
    ),
    path(
        "lease/",
        views.lease,
        name="lease",
    ),
    path(
        "compare/",
        TemplateView.as_view(template_name="pages/compare.html"),
        name="compare",
    ),
    path(
        "announcement/",
        TemplateView.as_view(template_name="pages/announcement.html"),
        name="announcement",
    ),
]