from django.shortcuts import render

# Uncomment after installing requests to connect to an external API.
# import requests


def home(request):
    # API hook:
    # response = requests.get("https://api.example.com/listings", timeout=10)
    # response.raise_for_status()
    # context = {"listings": response.json()}
    # return render(request, "pages/home.html", context)
    return render(request, "pages/home.html")


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
    return render(request, "pages/rent.html")


def lease(request):
    # API hook: create a rental listing from submitted form data.
    # payload = {
    #     "title": request.POST.get("title"),
    #     "description": request.POST.get("description"),
    #     "price": request.POST.get("price"),
    # }
    # response = requests.post(
    #     "https://api.example.com/rentals", json=payload, timeout=10
    # )
    # response.raise_for_status()
    # context = {"created_listing": response.json()}
    # return render(request, "pages/lease.html", context)
    return render(request, "pages/lease.html")


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