import json
from tempfile import TemporaryDirectory

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse

from .models import Listing, ListingPhoto


class AssistantPageTests(TestCase):
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

    def test_compare_page_contains_movable_canvas_and_placeholder_tools(self):
        response = self.client.get(reverse("compare"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "data-board-viewport")
        self.assertContains(response, "pages/compare.js")
        self.assertContains(response, "Пример")
        self.assertContains(response, "Макет с ИИ")