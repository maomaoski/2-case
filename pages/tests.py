from django.test import TestCase
from django.urls import reverse


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
        for page_name in ("rent", "lease", "sell"):
            with self.subTest(page=page_name):
                response = self.client.get(reverse(page_name))
                self.assertEqual(response.status_code, 200)