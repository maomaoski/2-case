import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings


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