import json
from urllib.parse import urlencode
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings


def request_fastapi(path, params=None, payload=None):
    query = urlencode(params or {}, doseq=True)
    endpoint = f"{settings.FASTAPI_BASE_URL.rstrip('/')}/{path.lstrip('/')}"
    if query:
        endpoint = f"{endpoint}?{query}"

    headers = {"Accept": "application/json"}
    body = None
    method = "GET"
    if payload is not None:
        headers["Content-Type"] = "application/json"
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        method = "POST"

    request = Request(endpoint, data=body, headers=headers, method=method)
    try:
        with urlopen(request, timeout=settings.FASTAPI_TIMEOUT) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"FastAPI вернул ошибку {error.code}: {detail}") from error
    except (URLError, TimeoutError, OSError) as error:
        raise RuntimeError("Не удалось подключиться к FastAPI.") from error


def fetch_fastapi_listings(city, deal_type):
    result = request_fastapi(
        "/api/listings",
        params={"city": city, "deal_type": deal_type},
    )
    return result.get("listings", [])


def search_fastapi(query_text):
    return request_fastapi("/api/search", params={"query_text": query_text}, payload={})


def publish_listing(payload):
    endpoint = settings.LISTINGS_API_URL.strip()
    if not endpoint:
        return {"enabled": False, "success": None}

    headers = {"Content-Type": "application/json"}
    if settings.LISTINGS_API_TOKEN:
        headers["Authorization"] = f"Bearer {settings.LISTINGS_API_TOKEN}"

    request = Request(
        endpoint,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers=headers,
        method="POST",
    )
    try:
        with urlopen(request, timeout=settings.LISTINGS_API_TIMEOUT) as response:
            return {"enabled": True, "success": 200 <= response.status < 300}
    except HTTPError as error:
        return {"enabled": True, "success": False, "status": error.code}
    except (URLError, TimeoutError, OSError):
        return {"enabled": True, "success": False}