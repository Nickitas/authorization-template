# Authorization Template

<div align="center">

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

### Полноценная система авторизации и аутентификации

</div>

## 📖 О проекте

Шаблон современного приложения авторизации: сессии в Redis, двухфакторная аутентификация, подтверждение почты и ролевая модель доступа.

**Сервер** NestJS с Prisma ORM и PostgreSQL.
**Клиент** ...
**Сессии** хранятся в Redis (не в памяти сервера), поэтому их жизнь не зависит от перезапусков, а масштабирование на несколько инстансов не ломает авторизацию.

**Письма** (подтверждение почты и т.д.) рендерятся через React Email. **Клиент** — Next.js.

## ✨ Возможности

- 🔐 **Аутентификация** — регистрация и вход по email/паролю, пароли хешируются Argon2
- 🍪 **Сессии** — на основе `express-session` с хранилищем в Redis
- 📧 **Подтверждение почты** — письма с токенами через React Email
- 🛡️ **Двухфакторная аутентификация** (2FA)
- 👥 **Ролевая модель** — `REGULAR` и другие роли + guards на эндпоинтах
- 🔗 **OAuth** — вход через сторонние провайдеры (модель `Account` с поддержкой нескольких провайдеров на пользователя)

## 🛠 Стек

| Слой           | Технологии                                       |
| -------------- | ------------------------------------------------ |
| Backend        | NestJS 12, TypeScript, class-validator           |
| База данных    | PostgreSQL 15, Prisma ORM 7 (driver adapters)    |
| Сессии / кеш   | Redis 8, ioredis, connect-redis, express-session |
| Безопасность   | Argon2, cookie-parser, CORS                      |
| Почта          | React Email, @nestjs-modules/mailer              |
| Инфраструктура | Docker Compose                                   |
| Тестирование   | Vitest                                           |
| Инструменты    | pnpm, oxlint, Prettier                           |

## 🚀 Быстрый старт

**Требования:** Node.js 22+, pnpm 10+, Docker

```bash
# 1. Клонировать и установить зависимости
git clone <repository-url>
cd authorization-template/server
pnpm install

# 2. Создать .env на основе шаблона и заполнить значения
cp .env.example .env

# 3. Поднять PostgreSQL и Redis
docker compose up -d

# 4. Применить схему базы данных
pnpm prisma db push

# 5. Запустить в режиме разработки
pnpm start:dev
```

API будет доступно на `http://localhost:4000`.

## 📮 Тестирование API

В папке [`postman/`](postman/) лежит готовая коллекция запросов и окружение для Postman:

1. Импортируйте `postman/authorization-template.postman_collection.json` и `postman/local.postman_environment.json`
2. Выберите окружение **local** в правом верхнем углу Postman
3. Выполняйте запросы — все URL уже настроены через `{{BASE_URL}}`

## 📁 Структура проекта

```
authorization-template/
├── server/               # NestJS API
│   ├── prisma/           # схема БД и сгенерированный Prisma Client
│   ├── src/
│   │   ├── auth/         # аутентификация, сессии, guards
│   │   ├── user/         # пользователи
│   │   ├── libs/         # общие утилиты
│   │   └── main.ts       # точка входа, сессии, CORS
│   └── docker-compose.yml
└── postman/              # коллекция запросов для тестирования API
```
