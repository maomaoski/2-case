from django.urls import path
from django.views.generic import TemplateView

from . import api, views


urlpatterns = [
    path("", views.home, name="home"),
    path("buy/", views.buy, name="buy"),
    path("api/listings/", api.listings, name="listings_api"),
    path("api/listings/<int:pk>/", api.listing_detail, name="listing_detail_api"),
    path("listing-preview/", views.listing_preview, name="listing_preview"),
    path("announcement/edit/", views.listing_edit, name="listing_edit"),
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
        "compare/",
        TemplateView.as_view(template_name="pages/compare.html"),
        name="compare",
    ),
    path(
        "announcement/",
        views.announcement,
        name="announcement",
    ),
]