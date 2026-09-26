from django.shortcuts import render
from django.shortcuts import get_object_or_404

from .models import Listing

# Uncomment after installing requests to connect to an external API.
# import requests


def home(request):
    # API hook:
    # response = requests.get("https://api.example.com/listings", timeout=10)
    # response.raise_for_status()
    # context = {"listings": response.json()}
    # return render(request, "pages/home.html", context)
    return render(request, "pages/home.html")


def buy(request):
    return render(
        request,
        "pages/buy.html",
        {"page_title": "Купить", "listing_type": "buy"},
    )


def announcement(request):
    return render(
        request,
        "pages/announcement.html",
        {"page_title": "Мои объявления", "listing_type": "all"},
    )


def listing_preview(request):
    listing_id = request.GET.get("id")
    listing = None
    if listing_id and listing_id.isdigit():
        listing = Listing.objects.prefetch_related("photos").filter(pk=listing_id).first()
    listing_type = request.GET.get(
        "type",
        listing.listing_type if listing else Listing.Type.BUY,
    )
    page_title = "Снять" if listing_type == Listing.Type.RENT else "Купить"
    return render(
        request,
        "pages/listing_preview.html",
        {"listing": listing, "listing_type": listing_type, "page_title": page_title},
    )


def listing_edit(request):
    listing_id = request.GET.get("id")
    listing = None
    if listing_id:
        if not listing_id.isdigit():
            return render(request, "pages/listing_edit.html", {"error": "Объявление не найдено."}, status=404)
        listing = get_object_or_404(Listing.objects.prefetch_related("photos"), pk=listing_id)
    return render(
        request,
        "pages/listing_edit.html",
        {"listing": listing, "page_title": "Настройка объявления"},
    )


def assistant(request):
    # API hook:
    # response = requests.get("https://api.example.com/assistant", timeout=10)
    # response.raise_for_status()
    # context = {"assistant_data": response.json()}
    # return render(request, "pages/assistant.html", context)
    return render(request, "pages/assistant.html")


def rent(request):
    # API hook: search available rental listings.
    # params = {"city": request.GET.get("city", "")}
    # response = requests.get(
    #     "https://api.example.com/rentals", params=params, timeout=10
    # )
    # response.raise_for_status()
    # context = {"listings": response.json()}
    # return render(request, "pages/rent.html", context)
    return render(
        request,
        "pages/rent.html",
        {"page_title": "Снять", "listing_type": "rent"},
    )


def sell(request):
    # API hook: create a sale listing from submitted form data.
    # payload = {
    #     "title": request.POST.get("title"),
    #     "description": request.POST.get("description"),
    #     "price": request.POST.get("price"),
    # }
    # response = requests.post(
    #     "https://api.example.com/sales", json=payload, timeout=10
    # )
    # response.raise_for_status()
    # context = {"created_listing": response.json()}
    # return render(request, "pages/sell.html", context)
    return render(request, "pages/sell.html")