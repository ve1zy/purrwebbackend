# Trello-like API

NestJS REST API для Trello-подобного приложения с авторизацией, PostgreSQL и Swagger.

## Функционал

- **JWT авторизация** (email/пароль)
- **CRUD** для Пользователей, Колонок, Карточек, Комментариев
- **Проверки владельца** — пользователи могут изменять только свои объекты
- **Swagger UI** на `/api`
- **PostgreSQL + Prisma ORM**
- **Docker** (полный запуск через `docker-compose`)
- **Postman коллекция** для тестирования

## Установка и запуск

### Локально

```bash
# Клонировать и установить зависимости
git clone <репозиторий>
cd purrwebbackend
npm install

# Настроить .env
cp .env.example .env
# Отредактировать .env (DATABASE_URL, JWT_SECRET, PORT)

# Prisma
npx prisma generate
npx prisma migrate dev --name init

# Запуск
npm run start:dev
```

### Docker (рекомендуется)

```bash
# Полный запуск с базой данных
docker-compose up --build

# Остановить
docker-compose down
```

API доступен на `http://localhost:3001`

## Документация

- **Swagger UI**: `http://localhost:3001/api`
- **Postman коллекция**: импортируй `Trello-API.postman_collection.json`
- **Окружение для Postman**: импортируй `Trello-API-Environment.postman_environment.json`

## Эндпоинты

### Авторизация
- `POST /auth/register` — регистрация
- `POST /auth/login` — вход

### Колонки
- `POST /columns` — создать колонку
- `GET /columns/me` — мои колонки
- `PATCH /columns/:id` — обновить
- `DELETE /columns/:id` — удалить

### Карточки
- `POST /cards/columns/:columnId` — создать карточку в колонке
- `GET /cards/columns/:columnId` — карточки колонки
- `PATCH /cards/:id` — обновить
- `DELETE /cards/:id` — удалить

### Комментарии
- `POST /comments/cards/:cardId` — создать комментарий
- `GET /comments/cards/:cardId` — комментарии карточки
- `PATCH /comments/:id` — обновить
- `DELETE /comments/:id` — удалить

## Стек технологий

- **Бэкенд**: NestJS, TypeScript
- **База данных**: PostgreSQL
- **ORM**: Prisma
- **Авторизация**: JWT + bcrypt
- **Документация**: Swagger
- **Контейнеризация**: Docker + docker-compose

## Схема базы данных

См. `dbdiagram.dbml` или открой Swagger UI.

## Примеры запросов

```bash
# Регистрация
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user1@example.com","password":"StrongPassword123","name":"John"}'

# Создание колонки (с токеном)
curl -X POST http://localhost:3001/columns \
  -H "Authorization: Bearer <токен>" \
  -H "Content-Type: application/json" \
  -d '{"title":"To Do","position":0}'
```
