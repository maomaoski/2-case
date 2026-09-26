"""
External Platform Scraper using only Avito as specified by user instructions.
"""

from typing import List, Dict, Any, Optional
from .avito_parser import AvitoRealEstateParser


class ExternalPlatformScraper:
    """
    Scraper interface for Avito real estate listings.
    """

    def __init__(self, proxy_pool: Optional[List[str]] = None):
        self.parser = AvitoRealEstateParser()

    async def fetch_city_listings(
        self,
        city: str = "Красноярск",
        deal_type: str = "rent",
        max_price: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        listings = self.parser.fetch_listings(city=city, deal_type=deal_type)
        if max_price:
            listings = [l for l in listings if l["price_rub"] <= max_price]
        return listings

    async def fetch_avito_cards(self, city: str = "Красноярск", deal_type: str = "rent") -> List[Dict[str, Any]]:
        return self.parser.fetch_listings(city=city, deal_type=deal_type)
