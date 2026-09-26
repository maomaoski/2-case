# GeoRent AI — Архитектура бэкенда, парсеров и интеграции с фронтендом

Полнофункциональный бэкенд на Python (**FastAPI + SQLAlchemy 2.0 + BeautifulSoup4**) для сервиса умного подбора жилья, анализа городской среды, генплана и льготных ипотек.

---

## 1. Архитектура и поток данных

```
User Query / Client Request
        │
        ▼
[FastAPI Router: main.py]
        │
        ├──> [GeminiProxyClient: gemini_proxy.py]
        │      ├── Direct / Reverse Proxy to Gemini 3.8 Flash
        │      └── Heuristic Fallback (при отсутствии API ключа)
        │
        ├──> [AvitoRealEstateParser: parsers/avito_parser.py]
        │      ├── Live requests с юзерагентом macOS Safari
        │      ├── HTML Analyzer (BeautifulSoup4 + Regex ссылки)
        │      ├── resolve_coordinates() — геокодер улиц Красноярска
        │      └── Verified Cache с честными URL Авито
        │
        ├──> [RealSourcesAnalyticsParser: parsers/real_sources_parser.py]
        │      ├── Генплан Красноярска (admkrsk.ru, Решение № В-269)
        │      ├── Калькулятор Семейной ипотеки (6%)
        │      └── Реестры открытых данных РФ (data.gov.ru)
        │
        └──> [SQLAlchemy ORM Models: models.py / schemas.py]
               └── Pydantic v2 сериализация и DTO
```

---

## 2. Реализованный парсер Авито (`parsers/avito_parser.py`)

Парсер обрабатывает города **Красноярск**, **Москва**, **Санкт-Петербург** (аренда и покупка).
Ссылки источников зафиксированы строго по вашей спецификации:
- `красноярск`: `https://www.avito.ru/krasnoyarsk/kvartiry/sdam-ASgBAgICAUSSA8gQ`
- `москва`: `https://www.avito.ru/moskva/kvartiry/sdam-ASgBAgICAUSSA8gQ`
- `спб`: `https://www.avito.ru/sankt-peterburg/kvartiry/sdam-ASgBAgICAUSSA8gQ`
- Покупка: `https://www.avito.ru/.../kvartiry/prodam-ASgBAgICAUSSA8YQ`

### Реальные квартиры Красноярска из вашего парсинга:
В коде жестко зафиксированы настоящие ссылки и описания из спарсенного фрагмента:
1. `https://www.avito.ru/krasnoyarsk/kvartiry/kvartira-studiya_242_m_616_et._7833564137` — Ольховая ул., 14 `[56.1152, 92.9348]` (21 000 ₽)
2. `https://www.avito.ru/krasnoyarsk/kvartiry/kvartira-studiya_227_m_99_et._8342146357` — пр-т Машиностроителей, 31А `[56.0028, 93.0235]` (25 000 ₽)
3. `https://www.avito.ru/krasnoyarsk/kvartiry/kvartira-studiya_31_m_2125_et._8367761673` — Дудинская ул., 2В `[56.0315, 92.9024]` (33 000 ₽)
4. `https://www.avito.ru/krasnoyarsk/kvartiry/1-k._kvartira_404_m_99_et._8254682996` — Телевизорный пер., 5А (СМ-Сити) `[56.0278, 92.8021]` (45 000 ₽)
5. `https://www.avito.ru/krasnoyarsk/kvartiry/1-k._kvartira_18_m_55_et._8356553859` — ул. Академика Киренского, 21 `[56.0215, 92.8150]` (16 500 ₽)
6. `https://www.avito.ru/krasnoyarsk/kvartiry/kvartira-studiya_28_m_218_et._8263992327` — ул. 78 Добровольческой Бригады, 26 `[56.0475, 92.9080]` (25 000 ₽)
7. `https://www.avito.ru/krasnoyarsk/kvartiry/kvartira-studiya_18_m_55_et._8094605003` — пр-т Свободный, 48 `[56.0230, 92.8120]` (25 000 ₽)
8. `https://www.avito.ru/krasnoyarsk/kvartiry/2-k._kvartira_54_m_1316_et._1968932346` — ул. Молокова, 12 `[56.0450, 92.9140]` (38 000 ₽)
9. `https://www.avito.ru/krasnoyarsk/kvartiry/2-k._kvartira_624_m_1318_et._8380984782` — ул. Караульная, 43 `[56.0395, 92.8760]` (30 000 ₽)
10. `https://www.avito.ru/krasnoyarsk/kvartiry/1-k._kvartira_41_m_110_et._8381150259` — ул. Пихтовая, 57 `[56.0680, 92.9420]` (35 000 ₽)
11. `https://www.avito.ru/krasnoyarsk/kvartiry/1-k._kvartira_407_m_1519_et._7226154150` — ул. Авиаторов, 45 `[56.0530, 92.9060]` (32 000 ₽)
12. `https://www.avito.ru/krasnoyarsk/kvartiry/2-k._kvartira_62_m_917_et._7833564153` — ул. Караульная, 41 (Покупка, ипотека 6%)

---

## 3. Инструкция по локальному развертыванию на macOS

### Шаг 1. Переход в папку и установка окружения
```bash
cd backend_fastapi
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Шаг 2. Запуск сервера FastAPI
```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
Интерактивная документация Swagger: `http://127.0.0.1:8000/docs`

### Шаг 3. Запуск парсера в терминале macOS
```bash
# Вызов с аргументами:
python3 parsers/avito_parser.py --city Красноярск --deal rent

# Парсинг локального HTML файла:
python3 parsers/avito_parser.py --file saved_page.html --city Красноярск
```

---

## 4. Заглушки (Stubs) и их перевод в боевой режим

1. **Gemini API (`gemini_proxy.py`)**:
   - Сейчас: при отсутствии ключа работает локальный эвристический парсер ключевых слов.
   - Как включить: задать `GEMINI_API_KEY` в `.env`. Если вы находитесь в РФ, укажите `GEMINI_PROXY_BASE_URL=https://api.proxyapi.ru/google/v1beta`.
2. **Блокировки Авито**:
   - Сейчас: с macOS выполняется реальный GET-запрос; в датацентрах срабатывает fallback на верифицированную базу.
   - Как включить: для промышленного сбора указать резидентный прокси `AVITO_PROXY_URL=http://user:pass@host:port`.
3. **Хранилище данных**:
   - Сейчас: in-memory списки для мгновенного старта без настройки БД.
   - Как включить: в `models.py` объявлены таблицы SQLAlchemy 2.0. В `main.py` подключить сессию `get_db` к PostgreSQL (`DATABASE_URL=postgresql://user:pass@localhost:5432/georent`).

---

## 5. Подключение стороннего фронтенда

Любой клиентский проект может обращаться к этому бэкенду.
1. Бэкенд возвращает стандартный JSON.
2. Включен CORS для всех хостов:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
3. Спецификацию можно скачать по адресу `http://127.0.0.1:8000/openapi.json`.
4. Список эндпоинтов:
   - `GET /api/listings?city=...&deal_type=...`
   - `POST /api/search?query_text=...`
   - `POST /api/tinder/filter`
   - `POST /api/parser/avito/run`
   - `GET /api/analytics/real-sources`
   - `POST /api/auth/register` / `POST /api/auth/login`
