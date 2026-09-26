from django.db import models


class Listing(models.Model):
    class Type(models.TextChoices):
        BUY = "buy", "Купить"
        RENT = "rent", "Снять"
        ANNOUNCEMENT = "announcement", "Объявление"

    listing_type = models.CharField(max_length=16, choices=Type.choices)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    filters = models.JSONField(default=list, blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at", "-pk")


class ListingPhoto(models.Model):
    listing = models.ForeignKey(Listing, related_name="photos", on_delete=models.CASCADE)
    image = models.FileField(upload_to="listings/")
    created_at = models.DateTimeField(auto_now_add=True)