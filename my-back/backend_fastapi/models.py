"""
Database models for Real Estate Search & AI Analytics platform (FastAPI + SQLAlchemy 2.0).
Implements all required domain entities:
- Предпочтения пользователя (UserPreferences)
- Район и локация (DistrictLocation)
- Новостройки (NewDevelopment)
- Льготные ипотеки (PreferentialMortgage)
- Рынок аренды (RentalMarket)
- Геоданные (GeoData)
- Генеральный план (MasterPlan)
- Открытые данные (OpenData)
- Анализ района (DistrictAnalysis)
- Будущая инфраструктура (FutureInfrastructure)
- Сравнение новостроек (NewBuildingComparison)
- Покупка vs аренда (BuyVsRentAnalysis)
- Аренда ближе/дальше (RentCloserVsFarther)
- Объяснение и источники (ExplanationAndSources)
- Отчёт (Report)
- Неопределённость (Uncertainty)
- Объявления (Listing - Global DB & Landlord submission)
- Локальная база пользователя (UserLocalComparison)
- Автопоиск по расписанию (ScheduledSearch)
"""

from datetime import datetime
from enum import Enum
from typing import Optional, List
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    Text,
    DateTime,
    ForeignKey,
    JSON,
    Enum as SQLEnum,
    Index
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class DealType(str, Enum):
    RENT = "rent"
    BUY = "buy"


class PropertyClass(str, Enum):
    ECONOMY = "economy"
    COMFORT = "comfort"
    BUSINESS = "business"
    PREMIUM = "premium"


class ListingSource(str, Enum):
    LANDLORD = "landlord"
    AVITO = "avito"
    CIAN = "cian"
    DOMCLICK = "domclick"


# 1. Предпочтения пользователя (UserPreferences)
class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), unique=True, index=True, nullable=False)
    deal_type = Column(SQLEnum(DealType), default=DealType.RENT, nullable=False)
    min_price = Column(Float, nullable=True)
    max_price = Column(Float, nullable=True)
    min_rooms = Column(Integer, default=1)
    max_rooms = Column(Integer, nullable=True)
    min_area_sqm = Column(Float, nullable=True)
    preferred_districts = Column(JSON, default=list)  # ["Хамовники", "Раменки", ...]
    require_schools = Column(Boolean, default=False)
    require_kindergartens = Column(Boolean, default=False)
    require_parks = Column(Boolean, default=False)
    max_walk_to_metro_min = Column(Integer, default=15)
    safety_importance_weight = Column(Float, default=0.8)  # 0.0 - 1.0
    mortgage_interest_type = Column(String(50), nullable=True)  # "семейная", "it", "рыночная"
    autosearch_enabled = Column(Boolean, default=True)
    autosearch_interval_days = Column(Integer, default=1)  # 1 or 2 days
    push_token = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    comparisons = relationship("UserLocalComparison", back_populates="user")
    scheduled_searches = relationship("ScheduledSearch", back_populates="user")


# 2. Район и локация (DistrictLocation)
class DistrictLocation(Base):
    __tablename__ = "district_locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), unique=True, index=True, nullable=False)  # e.g., "Раменки", "Пресненский"
    administrative_area = Column(String(100), nullable=False)  # e.g., "ЗАО", "ЦАО"
    avg_rent_price_sqm = Column(Float, default=0.0)
    avg_buy_price_sqm = Column(Float, default=0.0)
    safety_score = Column(Float, default=8.0)  # 1 to 10
    ecology_score = Column(Float, default=7.5)  # 1 to 10
    transport_score = Column(Float, default=8.5)
    commercial_infra_score = Column(Float, default=8.0)
    social_infra_score = Column(Float, default=8.5)
    description = Column(Text, nullable=True)

    listings = relationship("Listing", back_populates="district")
    geo_data = relationship("GeoData", back_populates="district", uselist=False)
    master_plan = relationship("MasterPlan", back_populates="district", uselist=False)
    open_data = relationship("OpenData", back_populates="district", uselist=False)
    district_analysis = relationship("DistrictAnalysis", back_populates="district", uselist=False)
    future_infrastructures = relationship("FutureInfrastructure", back_populates="district")


# 3. Новостройки (NewDevelopment)
class NewDevelopment(Base):
    __tablename__ = "new_developments"

    id = Column(Integer, primary_key=True, index=True)
    complex_name = Column(String(200), index=True, nullable=False)  # ЖК "Событие", ЖК "Остров"
    developer_name = Column(String(150), nullable=False)  # ПИК, Донстрой, Самолёт
    developer_reliability_rating = Column(Float, default=4.9)  # 1.0 - 5.0 (Единый Ресурс Застройщиков)
    property_class = Column(SQLEnum(PropertyClass), default=PropertyClass.COMFORT)
    completion_year = Column(Integer, nullable=False)  # 2026, 2027
    completion_quarter = Column(Integer, default=4)
    escrow_bank = Column(String(100), default="Сбербанк")
    construction_progress_pct = Column(Float, default=75.0)
    ceiling_height_meters = Column(Float, default=2.85)
    has_underground_parking = Column(Boolean, default=True)
    has_courtyard_without_cars = Column(Boolean, default=True)
    district_id = Column(Integer, ForeignKey("district_locations.id"))

    listings = relationship("Listing", back_populates="new_development")
    comparisons = relationship("NewBuildingComparison", back_populates="new_development")


# 4. Льготные ипотеки (PreferentialMortgage)
class PreferentialMortgage(Base):
    __tablename__ = "preferential_mortgages"

    id = Column(Integer, primary_key=True, index=True)
    program_name = Column(String(100), unique=True, nullable=False)  # "Семейная ипотека", "IT-ипотека"
    interest_rate_pct = Column(Float, nullable=False)  # 6.0, 5.0, 2.0
    min_down_payment_pct = Column(Float, default=20.0)
    max_loan_amount_rub = Column(Float, default=12000000.0)  # 12M for Moscow/SPb, 6M regions
    borrower_requirements = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    valid_until = Column(DateTime, nullable=True)


# 5. Рынок аренды (RentalMarket)
class RentalMarket(Base):
    __tablename__ = "rental_market"

    id = Column(Integer, primary_key=True, index=True)
    district_id = Column(Integer, ForeignKey("district_locations.id"), nullable=False)
    rooms_count = Column(Integer, nullable=False)  # 1, 2, 3
    median_monthly_rent_rub = Column(Float, nullable=False)
    monthly_price_change_pct = Column(Float, default=0.0)  # MoM динамика
    yearly_price_change_pct = Column(Float, default=0.0)  # YoY динамика
    avg_days_on_market = Column(Integer, default=14)  # Срок экспозиции
    rental_yield_annual_pct = Column(Float, default=5.4)  # Доходность сдачи
    updated_at = Column(DateTime, default=datetime.utcnow)


# 6. Геоданные (GeoData)
class GeoData(Base):
    __tablename__ = "geo_data"

    id = Column(Integer, primary_key=True, index=True)
    district_id = Column(Integer, ForeignKey("district_locations.id"), unique=True, nullable=False)
    center_latitude = Column(Float, nullable=False)
    center_longitude = Column(Float, nullable=False)
    boundary_polygon = Column(JSON, nullable=True)  # GeoJSON полигон
    nearest_metro_stations = Column(JSON, default=list)  # [{"name": "Раменки", "walk_min": 7, "line": "Солнцевская"}]
    schools_nearby_count = Column(Integer, default=0)
    top_schools_list = Column(JSON, default=list)  # Рейтинговые школы ТОП-100 Москвы
    kindergartens_count = Column(Integer, default=0)
    parks_list = Column(JSON, default=list)  # [{"name": "Парк 50-летия Октября", "distance_m": 400}]

    district = relationship("DistrictLocation", back_populates="geo_data")


# 7. Генеральный план (MasterPlan)
class MasterPlan(Base):
    __tablename__ = "master_plans"

    id = Column(Integer, primary_key=True, index=True)
    district_id = Column(Integer, ForeignKey("district_locations.id"), unique=True, nullable=False)
    krt_zones_count = Column(Integer, default=0)  # Комплексное развитие территорий (бывшие промзоны)
    krt_description = Column(Text, nullable=True)
    renovation_buildings_count = Column(Integer, default=0)  # Снос домов по программе реновации
    planned_roads_bridges = Column(JSON, default=list)  # Новые хорды, путепроводы
    planned_green_spaces = Column(JSON, default=list)
    horizon_year = Column(Integer, default=2035)

    district = relationship("DistrictLocation", back_populates="master_plan")


# 8. Открытые данные (OpenData)
class OpenData(Base):
    __tablename__ = "open_data"

    id = Column(Integer, primary_key=True, index=True)
    district_id = Column(Integer, ForeignKey("district_locations.id"), unique=True, nullable=False)
    crime_rate_per_10k = Column(Float, default=45.2)  # Статистика МВД по преступлениям
    air_quality_pm25 = Column(Float, default=12.4)  # Мосэкомониторинг (мкг/м3)
    green_area_share_pct = Column(Float, default=32.0)  # Доля озеленения района
    noise_level_db = Column(Float, default=48.0)
    source_portal_urls = Column(JSON, default=list)  # data.mos.ru, наш.дом.рф
    last_synced_at = Column(DateTime, default=datetime.utcnow)

    district = relationship("DistrictLocation", back_populates="open_data")


# 9. Анализ района (DistrictAnalysis)
class DistrictAnalysis(Base):
    __tablename__ = "district_analysis"

    id = Column(Integer, primary_key=True, index=True)
    district_id = Column(Integer, ForeignKey("district_locations.id"), unique=True, nullable=False)
    overall_verdict = Column(Text, nullable=False)  # AI заключение
    pros = Column(JSON, default=list)  # Плюсы района
    cons = Column(JSON, default=list)  # Минусы района
    population_density_per_sqkm = Column(Float, default=8500.0)
    family_suitability_score = Column(Float, default=8.8)  # 1 to 10
    investment_potential_score = Column(Float, default=8.2)

    district = relationship("DistrictLocation", back_populates="district_analysis")


# 10. Будущая инфраструктура (FutureInfrastructure)
class FutureInfrastructure(Base):
    __tablename__ = "future_infrastructure"

    id = Column(Integer, primary_key=True, index=True)
    district_id = Column(Integer, ForeignKey("district_locations.id"), nullable=False)
    project_type = Column(String(100), nullable=False)  # "Метро", "Школа", "Поликлиника", "Спортивный комплекс"
    title = Column(String(200), nullable=False)
    expected_launch_year = Column(Integer, nullable=False)  # e.g., 2026, 2028
    impact_on_real_estate_pct = Column(Float, default=10.0)  # Ожидаемый рост цен после открытия
    status = Column(String(100), default="Строится")  # Проектирование, Строится, Завершено

    district = relationship("DistrictLocation", back_populates="future_infrastructures")


# 11. Сравнение новостроек (NewBuildingComparison)
class NewBuildingComparison(Base):
    __tablename__ = "new_building_comparison"

    id = Column(Integer, primary_key=True, index=True)
    new_development_id = Column(Integer, ForeignKey("new_developments.id"), nullable=False)
    price_per_sqm = Column(Float, nullable=False)
    finishing_type = Column(String(100), default="Whitebox")  # Без отделки, Whitebox, Чистовая
    construction_timeline_risk = Column(String(50), default="Низкий")  # Низкий, Средний, Высокий
    invest_roi_forecast_pct = Column(Float, default=14.5)
    competitive_advantages = Column(JSON, default=list)

    new_development = relationship("NewDevelopment", back_populates="comparisons")


# 12. Покупка vs аренда (BuyVsRentAnalysis)
class BuyVsRentAnalysis(Base):
    __tablename__ = "buy_vs_rent_analysis"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=True)
    monthly_rent_payment = Column(Float, nullable=False)
    mortgage_monthly_payment = Column(Float, nullable=False)
    down_payment_rub = Column(Float, nullable=False)
    property_purchase_price = Column(Float, nullable=False)
    break_even_horizon_years = Column(Float, default=7.5)  # Точка безубыточности в годах
    deposit_opportunity_cost_rub = Column(Float, default=0.0)  # Если положить ПВ на депозит под ставку ЦБ
    recommendation_verdict = Column(Text, nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow)


# 13. Аренда ближе/дальше (RentCloserVsFarther)
class RentCloserVsFarther(Base):
    __tablename__ = "rent_closer_vs_farther"

    id = Column(Integer, primary_key=True, index=True)
    central_listing_id = Column(Integer, ForeignKey("listings.id"), nullable=True)
    farther_listing_id = Column(Integer, ForeignKey("listings.id"), nullable=True)
    monthly_price_diff_rub = Column(Float, nullable=False)  # Экономия на аренде
    monthly_commute_cost_diff_rub = Column(Float, default=0.0)  # Расход на транспорт
    commute_time_diff_hours_monthly = Column(Float, default=0.0)  # Потерянное время
    hourly_value_rub = Column(Float, default=1000.0)  # Стоимость часа времени
    net_monthly_benefit_rub = Column(Float, default=0.0)
    tradeoff_explanation = Column(Text, nullable=False)


# 14. Объяснение и источники (ExplanationAndSources)
class ExplanationAndSources(Base):
    __tablename__ = "explanation_and_sources"

    id = Column(Integer, primary_key=True, index=True)
    subject_entity = Column(String(100), nullable=False)  # "listing", "district", "mortgage"
    entity_id = Column(Integer, nullable=False)
    methodology_text = Column(Text, nullable=False)
    sources_citations = Column(JSON, default=list)  # [{"name": "ЕИСЖС наш.дом.рф", "url": "..."}]
    confidence_score = Column(Float, default=0.92)  # 0.0 - 1.0


# 15. Отчёт (Report)
class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), index=True, nullable=False)
    query_prompt = Column(Text, nullable=False)
    executive_summary = Column(Text, nullable=False)
    selected_listing_ids = Column(JSON, default=list)
    risk_assessment = Column(JSON, default=dict)
    mortgage_scenario = Column(JSON, default=dict)
    full_markdown_content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# 16. Неопределённость (Uncertainty)
class Uncertainty(Base):
    __tablename__ = "uncertainty"

    id = Column(Integer, primary_key=True, index=True)
    target_type = Column(String(50), nullable=False)  # "district", "listing", "mortgage"
    target_id = Column(Integer, nullable=False)
    key_rate_volatility_risk = Column(String(50), default="Средняя")  # Высокая, Средняя, Низкая
    construction_delay_probability_pct = Column(Float, default=8.0)
    rent_rate_seasonal_fluctuation_pct = Column(Float, default=12.0)
    risk_mitigation_advice = Column(Text, nullable=False)


# Глобальная база всех объявлений (Global DB)
class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    deal_type = Column(SQLEnum(DealType), default=DealType.RENT, index=True, nullable=False)
    source = Column(SQLEnum(ListingSource), default=ListingSource.LANDLORD, index=True)
    external_id = Column(String(100), nullable=True)  # ID на Авито / Циан
    price_rub = Column(Float, nullable=False, index=True)
    rooms_count = Column(Integer, default=1, index=True)
    area_sqm = Column(Float, nullable=False)
    floor = Column(Integer, default=1)
    total_floors = Column(Integer, default=9)
    address = Column(String(300), nullable=False)
    district_id = Column(Integer, ForeignKey("district_locations.id"), nullable=True)
    new_development_id = Column(Integer, ForeignKey("new_developments.id"), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # AI-обогащенные теги и свойства
    nearest_metro = Column(String(100), nullable=True)
    metro_walk_minutes = Column(Integer, default=10)
    nearest_school = Column(String(200), nullable=True)
    school_walk_minutes = Column(Integer, default=5)
    safety_score = Column(Float, default=8.5)
    photos = Column(JSON, default=list)
    description = Column(Text, nullable=True)
    ai_summary = Column(Text, nullable=True)
    ai_tags = Column(JSON, default=list)  # ["школа рядом", "тихий двор", "евроремонт", "льготная ипотека"]
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    district = relationship("DistrictLocation", back_populates="listings")
    new_development = relationship("NewDevelopment", back_populates="listings")


# Локальная база пользователя для сравнения
class UserLocalComparison(Base):
    __tablename__ = "user_local_comparisons"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), ForeignKey("user_preferences.user_id"), nullable=False)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    is_favorite = Column(Boolean, default=True)
    user_notes = Column(Text, nullable=True)
    added_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserPreferences", back_populates="comparisons")
    listing = relationship("Listing")


# Автопоиск по расписанию (Killer Feature)
class ScheduledSearch(Base):
    __tablename__ = "scheduled_searches"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), ForeignKey("user_preferences.user_id"), nullable=False)
    prompt_query = Column(Text, nullable=False)
    frequency_days = Column(Integer, default=1)  # раз в 1-2 дня
    last_run_at = Column(DateTime, nullable=True)
    next_run_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    matched_new_listings_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserPreferences", back_populates="scheduled_searches")


# 20. Учётная запись пользователя и друзья (UserAccount)
class UserAccount(Base):
    __tablename__ = "user_accounts"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)  # уникальное имя пользователя
    password_hash = Column(String(255), nullable=False)
    display_name = Column(String(100), nullable=False)  # отображаемое имя для других пользователей
    avatar_url = Column(String(500), nullable=True)
    liked_listing_ids = Column(JSON, default=list)  # список id лайкнутых квартир
    friends = Column(JSON, default=list)  # список usernames друзей
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

