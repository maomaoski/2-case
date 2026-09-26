<<<<<<< HEAD
# Дом и город

Минимальный Django-проект с главной страницей навигации и пустыми страницами назначения.

## Запуск

```powershell
python -m pip install -r requirements.txt
python manage.py runserver
```

Откройте `http://127.0.0.1:8000/`.

## Повторное использование кнопок

Шаблоны компонентов находятся в `pages/templates/components/`:

```django
{% include "components/filter_button.html" %}
{% include "components/city_button.html" %}
{% include "components/announcement_button.html" %}
```

Для выпадающих списков подключите `pages/base.html` как базовый шаблон: он загружает общие стили и JavaScript. Кнопка «Объявление» ведёт на маршрут с именем `announcement`.
=======
# 2-case
>>>>>>> a81cbba9d7596d17c6e9f9cbc29de8d663312a61
