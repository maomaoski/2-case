"""
Pydantic v2 validation schemas for FastAPI Real Estate AI platform.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class DealTypeEnum(str, Enum):
    RENT = "rent"
    BUY = "buy"


class PropertyClassEnum(str, Enum):
    ECONOMY = "economy"
    COMFORT = "comfort"
    BUSINESS = "business"
    PREMIUM = "premium"


class ListingSourceEnum(str, Enum):
    LANDLORD = "landlord"
    AVITO = "avito"
    CIAN = "cian"
    DOMCLICK = "domclick"


# Normalized entity output from Gemini
class NormalizedSearchQuery(BaseModel):
    original_query: str
    deal_type: DealTypeEnum = DealTypeEnum.RENT
    max_price: Optional[float] = None
    min_price: Optional[float] = None
    rooms: Optional[int] = None
    preferred_districts: List[str] = Field(default_factory=list)
    required_infrastructure: List[str] = Field(
        default_factory=list,
        description="e.g. ['school', 'metro', 'kindergarten', 'park']"
    )
    max_walk_to_metro_min: Optional[int] = None
    safety_importance: bool = False
    mortgage_preference: Optional[str] = None
    extracted_tags: List[str] = Field(default_factory=list)
    clean_search_keywords: List[str] = Field(default_factory=list)
    ai_reasoning: str


# Listing Schemas
class ListingBase(BaseModel):
    title: str
    deal_type: DealTypeEnum = DealTypeEnum.RENT
    source: ListingSourceEnum = ListingSourceEnum.LANDLORD
    price_rub: float
    rooms_count: int
    area_sqm: float
    floor: int
    total_floors: int
    address: str
    district_name: Optional[str] = None
    nearest_metro: Optional[str] = None
    metro_walk_minutes: int = 10
    nearest_school: Optional[str] = None
    school_walk_minutes: int = 5
    safety_score: float = 8.0
    photos: List[str] = Field(default_factory=list)
    description: Optional[str] = None


class LandlordCreateListingRequest(BaseModel):
    address: str
    deal_type: DealTypeEnum = DealTypeEnum.RENT
    price_rub: float
    rooms_count: int
    area_sqm: float
    floor: int
    total_floors: int
    description: str
    photos: List[str] = Field(default_factory=list)


class ListingResponse(ListingBase):
    id: int
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    ai_summary: Optional[str] = None
    ai_tags: List[str] = Field(default_factory=list)
    created_at: datetime

    class Config:
        from_attributes = True


# Analytical Block Schemas
class DistrictAnalyticsDTO(BaseModel):
    district_name: str
    safety_score: float
    ecology_score: float
    transport_score: float
    avg_rent_sqm: float
    avg_buy_sqm: float
    ai_verdict: str
    pros: List[str]
    cons: List[str]


class FutureInfrastructureDTO(BaseModel):
    title: str
    project_type: str
    expected_launch_year: int
    status: str
    impact_pct: float


class MortgageCalculationDTO(BaseModel):
    program_name: str
    rate_pct: float
    down_payment_rub: float
    monthly_payment_rub: float
    loan_term_years: int
    savings_vs_market_rub: float


class BuyVsRentDTO(BaseModel):
    monthly_rent_rub: float
    monthly_mortgage_rub: float
    break_even_years: float
    deposit_gain_comparison: str
    ai_recommendation: str


class CloserVsFartherDTO(BaseModel):
    central_price_rub: float
    farther_price_rub: float
    monthly_savings_rub: float
    commute_time_diff_hours: float
    verdict: str


class SearchResponse(BaseModel):
    normalized_query: NormalizedSearchQuery
    total_found: int
    top_listings: List[ListingResponse]
    ai_recommendations: str
    district_analysis: Optional[DistrictAnalyticsDTO] = None
    future_infrastructure: List[FutureInfrastructureDTO] = Field(default_factory=list)
    mortgage_scenario: Optional[MortgageCalculationDTO] = None
    buy_vs_rent: Optional[BuyVsRentDTO] = None
    rent_closer_vs_farther: Optional[CloserVsFartherDTO] = None
    sources_citations: List[Dict[str, str]] = Field(default_factory=list)
    uncertainty_notes: List[str] = Field(default_factory=list)


# Landlord enriched response
class LandlordListingEnrichmentResponse(BaseModel):
    listing: ListingResponse
    inferred_district: str
    inferred_metro: str
    metro_walk_minutes: int
    inferred_schools: List[str]
    inferred_safety_score: float
    generated_tags: List[str]
    market_price_evaluation: str


# Scheduled search & push subscription
class ScheduledSearchRequest(BaseModel):
    user_id: str
    prompt_query: str
    frequency_days: int = 1
    push_token: Optional[str] = None


class ScheduledSearchResponse(BaseModel):
    id: int
    user_id: str
    prompt_query: str
    frequency_days: int
    is_active: bool
    created_at: datetime
    message: str


# User Auth & Friends Schemas
class UserRegisterRequest(BaseModel):
    username: str
    password: str
    display_name: str


class UserLoginRequest(BaseModel):
    username: str
    password: str


class UserProfileDTO(BaseModel):
    id: int
    username: str
    display_name: str
    avatar_url: Optional[str] = None
    liked_listing_ids: List[int] = Field(default_factory=list)
    friends: List[str] = Field(default_factory=list)


class AddFriendRequest(BaseModel):
    username: str
    friend_username: str

