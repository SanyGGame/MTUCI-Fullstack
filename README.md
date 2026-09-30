# Личный финучёт

## 1. Назначение и сценарии
**Цель:** Приложение для базового учета личных доходов и расходов.

**Пользовательские сценарии:**
- Просмотр текущего баланса и краткой сводки за месяц на главном экране.
- Просмотр общего списка доходов и расходов.
- Навигация по основным разделам учета (транзакции, категории, бюджеты).

**Основные экраны:**
- `/` — Обзор (Dashboard)
- `/transactions` — Транзакции
- `/categories` — Категории
- `/budgets` — Бюджеты
- `/reports` — Отчёты

## 2. Стек и реализация
- **Frontend:** React + TypeScript + Vite, React Router DOM, Material-UI
- **Backend:** Python + FastAPI, Pydantic, pydantic-settings
- **База данных:** PostgreSQL, SQLAlchemy 2.0

## 3. Скриншоты и изменения UI
Скриншоты всех реализованных экранов сохранены в папке `docs/screenshots`:
- `01-dashboard.png`
- `02-transactions.png`
- `03-categories.png`
- `04-budgets.png`
- `05-reports.png`

**История изменений:**
- *v0.1.0:* Создана первоначальная версия интерфейса. Настроена маршрутизация, добавлено боковое меню, сверстаны экраны с использованием компонентов MUI.
- *v0.2.0:* Добавлен backend: API и модель данных в PostgreSQL.

## 4. Запуск frontend
Требуется Node.js 20+.

```bash
cd frontend
npm install
npm run dev
```

Приложение откроется по адресу `http://localhost:5173`.

## 5. Backend

### Структура
```
backend/
├── app/
│   ├── api/          # маршруты: categories, transactions, budgets
│   ├── core/         # config (настройки), database (подключение и сессии)
│   ├── models/       # модели SQLAlchemy
│   ├── schemas/      # схемы валидации запросов и ответов
│   ├── services/     # операции с данными и бизнес-логика
│   └── main.py       # создание приложения
├── .env.example      # пример настроек без секретов
└── requirements.txt
```

### Модель данных
| Таблица | Поля | Назначение |
|---|---|---|
| `categories` | `id` (PK), `name`, `type` (`income` / `expense`), `color`, `icon` | Категории доходов и расходов. Пара `name` + `type` уникальна |
| `transactions` | `id` (PK), `date`, `amount`, `description`, `category_id` (FK → `categories.id`) | Операции. `amount > 0`. Тип операции (доход или расход) определяется её категорией |
| `budgets` | `id` (PK), `category_id` (FK → `categories.id`), `month`, `monthly_limit` | Месячный лимит расходов по категории. Пара `category_id` + `month` уникальна, `monthly_limit > 0` |

Все `id` — UUID. Связь «категория — операции» и «категория — бюджеты»: один ко многим.
- Категорию, к которой привязаны операции, удалить нельзя (`ON DELETE RESTRICT`, API отвечает `409`).
- При удалении категории её бюджеты удаляются вместе с ней (`ON DELETE CASCADE`).
- Бюджет можно задать только для категории расходов. Поле `month` всегда хранит первое число месяца.
- В ответе API у бюджета есть вычисляемое поле `spent` — сумма расходов по категории за месяц бюджета.
- Тип категории нельзя изменить, если у неё уже есть операции или бюджеты.

### API
Все маршруты имеют префикс `/api/v1`. Интерактивная документация: `http://localhost:8000/docs`.

| Ресурс | Методы |
|---|---|
| `/categories` | `GET` (фильтр `type`), `POST` |
| `/categories/{id}` | `GET`, `PATCH`, `DELETE` |
| `/transactions` | `GET` (фильтры `type`, `category_id`, `date_from`, `date_to`), `POST` |
| `/transactions/{id}` | `GET`, `PATCH`, `DELETE` |
| `/budgets` | `GET` (фильтр `month`), `POST` |
| `/budgets/{id}` | `GET`, `PATCH` (только `monthly_limit`), `DELETE` |

Проверка работы сервера: `GET /health` (без префикса).

Коды ответов: `200` — успех, `201` — создано, `404` — запись не найдена, `409` — конфликт (дубликат, категория используется), `422` — некорректные данные.
Текст ошибки приходит в поле `detail`. При некорректных данных FastAPI возвращает в `detail` список ошибок с указанием поля (`loc`) и причины (`msg`).

Денежные суммы (`amount`, `monthly_limit`, `spent`) API возвращает строками, например `"3200.00"`, чтобы не терять точность.

### Подготовка и запуск
Требуются Python 3.11+ и PostgreSQL.

**1. Создайте пользователя и базу данных** (в `psql` под администратором, например `psql -U postgres`):
```sql
CREATE USER finance WITH PASSWORD 'ваш_пароль';
CREATE DATABASE finance OWNER finance;
```

**2. Установите зависимости:**
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**3. Настройте окружение.** Скопируйте пример и впишите свои значения (файл `.env` в Git не попадает):
```bash
cp .env.example .env            # Windows: copy .env.example .env
```

**4. Запустите сервер:**
```bash
uvicorn app.main:app --reload
```
Таблицы создаются автоматически при первом запуске. API будет доступен по адресу `http://localhost:8000`.