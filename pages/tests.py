import json
from tempfile import TemporaryDirectory
from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse

from .models import Listing, ListingPhoto


class AssistantPageTests(TestCase):
    def test_home_shows_linked_fallback_tiles_when_database_is_empty(self):
        response = self.client.get(reverse("home"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "data-home-placeholder", count=9)
        self.assertContains(response, 'href="/buy/"')
        self.assertContains(response, 'href="/rent/"')
        self.assertNotContains(response, ">buy<")
        self.assertNotContains(response, ">rent<")

    def test_home_cards_link_to_listing_preview_and_show_price(self):
        listing = Listing.objects.create(
            listing_type=Listing.Type.RENT,
            title="Квартира на главной",
            city="Красноярск",
            price="28000",
        )

        response = self.client.get(reverse("home"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(
            response,
            f'href="{reverse("listing_preview")}?id={listing.pk}&amp;type=rent"',
        )
        self.assertRegex(response.content.decode("utf-8"), r"28[\s,]000 ₽")

    def test_home_links_to_assistant_without_embedding_chat(self):
        response = self.client.get(reverse("home"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, reverse("assistant"))
        self.assertNotContains(response, "data-chat-form")

    def test_assistant_page_contains_chat_form(self):
        response = self.client.get(reverse("assistant"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "data-chat-form")
        self.assertContains(response, "data-chat-messages")

    def test_rental_and_sale_pages_render(self):
        for page_name in ("rent", "sell"):
            with self.subTest(page=page_name):
                response = self.client.get(reverse(page_name))
                self.assertEqual(response.status_code, 200)

    def test_buy_and_rent_use_the_search_layout(self):
        for page_name in ("buy", "rent"):
            with self.subTest(page=page_name):
                response = self.client.get(reverse(page_name))
                self.assertEqual(response.status_code, 200)
                self.assertContains(response, "data-listing-page")
                self.assertContains(response, "pages/listings.js")
                self.assertContains(response, "/listing-preview/")
                self.assertNotContains(response, "data-open-listing-form")
                self.assertNotContains(response, "Поиск с помощью ИИ")
                self.assertNotContains(response, "/lease/")

    def test_announcement_page_uses_the_listings_layout(self):
        response = self.client.get(reverse("announcement"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "data-listing-page")
        self.assertContains(response, "pages/listings.js")
        self.assertContains(response, "data-open-listing-form")
        self.assertContains(response, "/announcement/edit/")
        self.assertContains(response, "Мои объявления")
        self.assertNotContains(response, "/lease/")

    def test_listing_preview_is_read_only_and_photo_ready(self):
        response = self.client.get(reverse("listing_preview"), {"type": "rent"})

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Фотография жилья")
        self.assertContains(response, "Аренда")
        self.assertNotContains(response, "<input")
        self.assertNotContains(response, "Добавить фото")

    @patch("pages.views.fetch_fastapi_listings")
    def test_external_listing_preview_shows_fastapi_data_and_source(self, fetch_listings):
        fetch_listings.return_value = [{
            "id": 123,
            "title": "Студия из каталога",
            "deal_type": "rent",
            "city": "Москва",
            "price_rub": 25000,
            "address": "Москва, улица Тестовая",
            "photos": ["https://example.com/photo.jpg"],
            "url": "https://www.avito.ru/listing/123",
            "description": "Описание квартиры",
        }]

        response = self.client.get(reverse("listing_preview"), {
            "source": "fastapi",
            "id": "123",
            "city": "Москва",
            "type": "rent",
        })

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Студия из каталога")
        self.assertContains(response, "Москва, улица Тестовая")
        self.assertContains(response, "Открыть оригинал объявления")

    def test_listing_editor_has_filters_and_photo_upload(self):
        response = self.client.get(reverse("listing_edit"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'name="filters"')
        self.assertContains(response, 'name="photos"')
        self.assertContains(response, "pages/listing-editor.js")

    def test_listing_api_creates_and_filters_records(self):
        payload = {
            "listing_type": "buy",
            "title": "Квартира у парка",
            "description": "Две комнаты",
            "price": "12500000",
        }
        response = self.client.post(
            reverse("listings_api"),
            data=json.dumps(payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Listing.objects.count(), 1)
        self.assertEqual(response.json()["listing"]["title"], payload["title"])
        filtered = self.client.get(reverse("listings_api"), {"type": "buy"})
        self.assertEqual(filtered.status_code, 200)
        self.assertEqual(len(filtered.json()["listings"]), 1)

    def test_listing_api_rejects_invalid_data(self):
        response = self.client.post(
            reverse("listings_api"),
            data=json.dumps({"listing_type": "rent", "title": "", "price": "-1"}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Listing.objects.count(), 0)

    @patch("pages.api.fetch_fastapi_listings")
    def test_catalog_endpoint_uses_fastapi_and_returns_preview_links(self, fetch_listings):
        Listing.objects.create(
            listing_type=Listing.Type.RENT,
            title="Квартира из SQLite",
            city="Москва",
            price="28000",
        )
        fetch_listings.return_value = [{
            "id": 123,
            "title": "Студия",
            "deal_type": "rent",
            "price_rub": 25000,
            "url": "https://www.avito.ru/listing/123",
        }]

        response = self.client.get(
            reverse("catalog_api"),
            {"city": "Москва", "deal_type": "rent"},
        )

        self.assertEqual(response.status_code, 200)
        fetch_listings.assert_called_once_with("Москва", "rent")
        listings = response.json()["listings"]
        self.assertEqual(len(listings), 2)
        self.assertEqual(listings[0]["title"], "Квартира из SQLite")
        self.assertIn("id=1", listings[0]["detail_url"])
        self.assertIn("source=fastapi", listings[1]["detail_url"])
        self.assertIn("id=123", listings[1]["detail_url"])

    @patch("pages.api.fetch_fastapi_listings")
    @patch("pages.api.search_fastapi")
    def test_assistant_search_filters_catalog_and_returns_detail_links(
        self, search_listings, fetch_listings
    ):
        search_listings.return_value = {
            "normalized_query": {
                "deal_type": "rent",
                "max_price": 30000,
                "rooms": 1,
                "preferred_districts": [],
            },
            "ai_recommendations": "Подходящие варианты.",
        }
        fetch_listings.return_value = [
            {"id": 1, "title": "Подходит", "price_rub": 25000, "rooms_count": 1},
            {"id": 2, "title": "Дороже бюджета", "price_rub": 35000, "rooms_count": 1},
            {"id": 3, "title": "Другая комнатность", "price_rub": 25000, "rooms_count": 2},
        ]

        response = self.client.post(
            reverse("assistant_api"),
            data=json.dumps({"message": "Снять квартиру до 30 тысяч в Красноярске"}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        search_listings.assert_called_once_with("Снять квартиру до 30 тысяч в Красноярске")
        fetch_listings.assert_called_once_with("Красноярск", "rent")
        result = response.json()
        self.assertEqual([item["id"] for item in result["listings"]], [1])
        self.assertIn("source=fastapi", result["listings"][0]["detail_url"])
        self.assertIn("Подходящие варианты.", result["reply"])

    def test_listing_api_updates_profile_filters_and_photos(self):
        listing = Listing.objects.create(
            listing_type=Listing.Type.RENT,
            title="Квартира",
        )
        with TemporaryDirectory() as media_root:
            with override_settings(MEDIA_ROOT=media_root):
                created = self.client.post(
                    reverse("listings_api"),
                    {
                        "listing_type": "rent",
                        "title": "Квартира с фото",
                        "filters": ["Лифт", "Балкон"],
                        "photos": SimpleUploadedFile(
                            "room.png",
                            b"fake image bytes",
                            content_type="image/png",
                        ),
                    },
                )
                self.assertEqual(created.status_code, 201)
                photo_listing_id = created.json()["listing"]["id"]
                photo_id = ListingPhoto.objects.get(listing_id=photo_listing_id).pk
                update_url = reverse("listing_detail_api", args=[photo_listing_id])
                updated = self.client.post(
                    update_url,
                    {
                        "listing_type": "rent",
                        "title": "Квартира с фото",
                        "filters": ["Лифт"],
                        "remove_photos": [str(photo_id)],
                    },
                )

        self.assertEqual(updated.status_code, 200)
        self.assertEqual(updated.json()["listing"]["filters"], ["Лифт"])
        self.assertEqual(updated.json()["listing"]["photos"], [])
        self.assertFalse(ListingPhoto.objects.filter(pk=photo_id).exists())

    def test_compare_page_has_listing_picker_and_canvas_tools(self):
        response = self.client.get(reverse("compare"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "data-board-viewport")
        self.assertContains(response, "pages/compare.js")
        self.assertContains(response, "data-board-listing-select")
        self.assertContains(response, "data-add-board-listing")
        self.assertContains(response, "data-listings-url")