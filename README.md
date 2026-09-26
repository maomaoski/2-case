# Кварт

Веб-приложение для просмотра объявлений о покупке и аренде жилья, публикации собственных объявлений, поиска через AI-ассистента и сравнения квартир.

## Стек и структура

- Django 5.2 и SQLite: основной сайт и хранилище созданных пользователями объявлений.
- FastAPI: отдельный API для каталога внешних предложений, нормализации AI-запросов и аналитики. Исходники находятся в [`my-back/backend_fastapi`](my-back/backend_fastapi/).
- HTML-шаблоны, стили и клиентский JavaScript сайта находятся в [`pages`](pages/).

## Быстрый запуск сайта

В PowerShell из корня проекта:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

Откройте `http://127.0.0.1:8000/`.

## FastAPI

Для внешнего каталога и AI-поиска запустите API в отдельном терминале. Порт `8000` уже используется Django, поэтому FastAPI запускается на `8001`:

```powershell
cd my-back
python -m pip install -r backend_fastapi/requirements.txt
python -m uvicorn backend_fastapi.main:app --host 127.0.0.1 --port 8001 --reload
```

Swagger UI: `http://127.0.0.1:8001/docs`. Django обращается к нему через `FASTAPI_BASE_URL`, по умолчанию `http://127.0.0.1:8001`. Если FastAPI выключен, объявления из локальной SQLite продолжают отображаться; внешний каталог и AI-поиск недоступны.

Подробная документация по FastAPI: [`my-back/API_README.md`](my-back/API_README.md). В ней описаны эндпоинты, запуск парсеров и настройки прокси.

## Страницы сайта

- `/` — главная страница с карточками объявлений.
- `/buy/` и `/rent/` — каталог покупки и аренды с фильтрами.
- `/announcement/` — объявления, созданные через сайт.
- `/announcement/edit/` — создание и редактирование объявления.
- `/assistant/` — AI-поиск квартир.
- `/compare/` — доска объявлений для сравнения.
- `/listing-preview/` — просмотр объявления.

## Django API

- `GET /api/listings/?type=all|buy|rent|announcement` — список локальных объявлений.
- `POST /api/listings/` — создать объявление.
- `GET /api/listings/<id>/` — получить объявление.
- `POST`, `PUT` или `PATCH /api/listings/<id>/` — обновить объявление.
- `GET /api/catalog/?city=Красноярск&deal_type=rent` — объединённый каталог из SQLite и FastAPI.
- `POST /api/assistant/` — передать AI-ассистенту JSON с полем `message`.

Локальные записи сайта хранятся в `db.sqlite3`. SQLAlchemy-модели FastAPI определены отдельно; для них требуется самостоятельная настройка `DATABASE_URL`.

## Проверки

```powershell
python manage.py test pages.tests
```
