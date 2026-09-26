import json
from decimal import Decimal, InvalidOperation

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.views.decorators.http import require_http_methods
from django.views.decorators.http import require_GET, require_POST
from urllib.parse import urlencode

from .api_client import fetch_fastapi_listings, publish_listing, search_fastapi
from .models import Listing, ListingPhoto


def serialize_listing(listing):
    return {
        "id": listing.pk,
        "listing_type": listing.listing_type,
        "title": listing.title,
        "description": listing.description,
        "city": listing.city,
        "filters": listing.filters,
        "price": str(listing.price) if listing.price is not None else None,
        "created_at": listing.created_at.isoformat(),
        "photos": [
            {"id": photo.pk, "url": photo.image.url}
            for photo in listing.photos.all()
        ],
    }


def read_payload(request):
    if request.content_type.startswith("application/json"):
        try:
            payload = json.loads(request.body or b"{}")
        except (json.JSONDecodeError, UnicodeDecodeError):
            return None, [], "Некорректный JSON."
        if not isinstance(payload, dict):
            return None, [], "Ожидается JSON-объект."
        return payload, [], None

    payload = request.POST.dict()
    payload["filters"] = request.POST.getlist("filters")
    payload["remove_photos"] = request.POST.getlist("remove_photos")
    return payload, request.FILES.getlist("photos"), None


def normalize_listing(payload, listing=None):
    title = str(payload.get("title", listing.title if listing else "")).strip()
    description = str(
        payload.get("description", listing.description if listing else "")
    ).strip()
    city = str(payload.get("city", listing.city if listing else "")).strip()
    listing_type = payload.get(
        "listing_type",
        listing.listing_type if listing else Listing.Type.ANNOUNCEMENT,
    )
    raw_price = payload.get("price", listing.price if listing else None)
    filters = payload.get("filters", listing.filters if listing else [])
    if isinstance(filters, str):
        try:
            filters = json.loads(filters)
        except json.JSONDecodeError:
            return None, "Фильтры переданы в неверном формате."

    if not title or len(title) > 200:
        return None, "Укажите название не длиннее 200 символов."
    if len(city) > 100:
        return None, "Название города не должно быть длиннее 100 символов."
    if listing_type not in Listing.Type.values:
        return None, "Неизвестный тип объявления."
    if not isinstance(filters, list) or any(not isinstance(item, str) for item in filters):
        return None, "Фильтры должны быть списком строк."

    price = None
    if raw_price not in (None, ""):
        try:
            price = Decimal(str(raw_price))
        except InvalidOperation:
            return None, "Цена должна быть числом."
        if not price.is_finite() or price < 0 or price >= Decimal("10000000000"):
            return None, "Укажите допустимую неотрицательную цену."
        if price.as_tuple().exponent < -2:
            return None, "Цена может содержать не более двух знаков после запятой."

    return {
        "listing_type": listing_type,
        "title": title,
        "description": description,
        "city": city,
        "filters": list(dict.fromkeys(item.strip() for item in filters if item.strip())),
        "price": price,
    }, None


def validate_photos(files):
    allowed_types = {"image/jpeg", "image/png", "image/webp", "image/gif"}
    if any(file.content_type not in allowed_types for file in files):
        return "Поддерживаются изображения JPEG, PNG, WebP и GIF."
    if any(file.size > 10 * 1024 * 1024 for file in files):
        return "Размер одной фотографии не должен превышать 10 МБ."
    return None


def update_photos(listing, payload, files):
    for photo_id in payload.get("remove_photos", []):
        photo = listing.photos.filter(pk=photo_id).first()
        if photo:
            photo.image.delete(save=False)
            photo.delete()
    for image in files:
        ListingPhoto.objects.create(listing=listing, image=image)
    getattr(listing, "_prefetched_objects_cache", {}).pop("photos", None)


def catalog_detail_url(item, city, deal_type):
    query = urlencode({
        "source": "fastapi",
        "id": item.get("id", ""),
        "city": city,
        "type": deal_type,
    })
    return f"{reverse('listing_preview')}?{query}"


def local_catalog_items(city, deal_type):
    items = []
    queryset = Listing.objects.filter(listing_type=deal_type, city__iexact=city)
    for listing in queryset:
        item = serialize_listing(listing)
        item.update({
            "price_rub": float(listing.price) if listing.price is not None else 0,
            "rooms_count": None,
            "source": "quart",
            "address": listing.city,
            "detail_url": f"{reverse('listing_preview')}?{urlencode({'id': listing.pk, 'type': deal_type})}",
        })
        items.append(item)
    return items


@require_GET
def catalog(request):
    city = request.GET.get("city", "Красноярск").strip() or "Красноярск"
    deal_type = request.GET.get("deal_type", "rent")
    if deal_type not in {Listing.Type.BUY, Listing.Type.RENT}:
        return JsonResponse({"error": "Неизвестный тип сделки."}, status=400)
    items = local_catalog_items(city, deal_type)
    warning = ""
    try:
        external_items = fetch_fastapi_listings(city, deal_type)
    except RuntimeError as error:
        external_items = []
        warning = str(error)

    for item in external_items:
        item["detail_url"] = catalog_detail_url(item, city, deal_type)
    items.extend(external_items)
    return JsonResponse({"listings": items, "total": len(items), "warning": warning})


def city_from_query(query_text):
    lowered = query_text.lower()
    if "москв" in lowered:
        return "Москва"
    if "петербург" in lowered or "питер" in lowered or "спб" in lowered:
        return "Санкт-Петербург"
    return "Красноярск"


@require_POST
def assistant_search(request):
    payload, _, error = read_payload(request)
    if error:
        return JsonResponse({"error": error}, status=400)
    message = str(payload.get("message", "")).strip()
    if not message:
        return JsonResponse({"error": "Напишите запрос для поиска."}, status=400)

    try:
        search_result = search_fastapi(message)
        criteria = search_result.get("normalized_query", {})
        city = city_from_query(message)
        deal_type = criteria.get("deal_type", "rent")
        if deal_type not in {Listing.Type.BUY, Listing.Type.RENT}:
            deal_type = "rent"
        listings = local_catalog_items(city, deal_type)
        listings.extend(fetch_fastapi_listings(city, deal_type))
    except RuntimeError as error:
        return JsonResponse({"error": str(error)}, status=502)

    max_price = criteria.get("max_price")
    min_price = criteria.get("min_price")
    rooms = criteria.get("rooms")
    districts = [value.lower() for value in criteria.get("preferred_districts", [])]
    if max_price is not None:
        listings = [item for item in listings if float(item.get("price_rub", 0)) <= float(max_price)]
    if min_price is not None:
        listings = [item for item in listings if float(item.get("price_rub", 0)) >= float(min_price)]
    if rooms is not None:
        listings = [item for item in listings if item.get("rooms_count") == rooms]
    if districts:
        listings = [
            item for item in listings
            if any(term in f"{item.get('district_name', '')} {item.get('address', '')}".lower() for term in districts)
        ]

    for item in listings:
        item["detail_url"] = catalog_detail_url(item, city, deal_type)
    recommendation = search_result.get("ai_recommendations", "")
    reply = f"{recommendation}\n\nНайдено квартир: {len(listings)}."
    return JsonResponse({
        "reply": reply,
        "city": city,
        "deal_type": deal_type,
        "criteria": criteria,
        "listings": listings,
    })


@require_http_methods(["GET", "POST"])
def listings(request):
    if request.method == "GET":
        listing_type = request.GET.get("type", "all")
        if listing_type not in {"all", *Listing.Type.values}:
            return JsonResponse({"error": "Неизвестный тип объявления."}, status=400)
        queryset = Listing.objects.all()
        if listing_type != "all":
            queryset = queryset.filter(listing_type=listing_type)
        return JsonResponse({"listings": [serialize_listing(item) for item in queryset]})

    payload, files, error = read_payload(request)
    if error:
        return JsonResponse({"error": error}, status=400)
    values, error = normalize_listing(payload)
    if error:
        return JsonResponse({"error": error}, status=400)
    error = validate_photos(files)
    if error:
        return JsonResponse({"error": error}, status=400)

    listing = Listing.objects.create(**values)
    update_photos(listing, payload, files)
    serialized = serialize_listing(listing)
    external_api = publish_listing(serialized)
    return JsonResponse(
        {"listing": serialized, "external_api": external_api},
        status=201,
    )


@require_http_methods(["GET", "POST", "PUT", "PATCH"])
def listing_detail(request, pk):
    listing = get_object_or_404(Listing.objects.prefetch_related("photos"), pk=pk)
    if request.method == "GET":
        return JsonResponse({"listing": serialize_listing(listing)})

    payload, files, error = read_payload(request)
    if error:
        return JsonResponse({"error": error}, status=400)
    values, error = normalize_listing(payload, listing)
    if error:
        return JsonResponse({"error": error}, status=400)
    error = validate_photos(files)
    if error:
        return JsonResponse({"error": error}, status=400)

    for field, value in values.items():
        setattr(listing, field, value)
    listing.save()
    update_photos(listing, payload, files)
    serialized = serialize_listing(listing)
    external_api = publish_listing(serialized)
    return JsonResponse({"listing": serialized, "external_api": external_api})