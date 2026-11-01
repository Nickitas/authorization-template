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

**Сервер** — NestJS с Prisma ORM и PostgreSQL. **Клиент** — Next.js (App Router) с Tailwind CSS и TanStack Query.

**Сессии** хранятся в Redis (не в памяти сервера), поэтому их жизнь не зависит от перезапусков, а масштабирование на несколько инстансов не ломает авторизацию.

**Письма** (подтверждение почты и т.д.) рендерятся через React Email.

## ✨ Возможности

- 🔐 **Аутентификация** — регистрация и вход по email/паролю, пароли хешируются Argon2
- 🍪 **Сессии** — на основе `express-session` с хранилищем в Redis
- 📧 **Подтверждение почты** — письма с токенами через React Email
- 🛡️ **Двухфакторная аутентификация** (2FA)
- 👥 **Ролевая модель** — `REGULAR` и другие роли + guards на эндпоинтах
- 🔗 **OAuth** — вход через сторонние провайдеры (модель `Account` с поддержкой нескольких провайдеров на пользователя)
- 🎨 **Клиент** — Next.js с тёмной/светлой темой и готовыми UI-компонентами (shadcn-стиль на Base UI)

## 🛠 Стек

| Слой           | Технологии                                                     |
| -------------- | -------------------------------------------------------------- |
| Frontend       | Next.js 16, React 19, TypeScript, Tailwind CSS 4, TanStack Query |
| UI             | Base UI, shadcn, lucide-react, next-themes                     |
| Backend        | NestJS 12, TypeScript, class-validator                         |
| База данных    | PostgreSQL 15, Prisma ORM 7 (driver adapters)                  |
| Сессии / кеш   | Redis 8, ioredis, connect-redis, express-session               |
| Безопасность   | Argon2, cookie-parser, CORS                                    |
| Почта          | React Email, @nestjs-modules/mailer                            |
| Инфраструктура | Docker Compose                                                 |
| Тестирование   | Vitest                                                         |
| Инструменты    | pnpm, oxlint, ESLint, Prettier                                 |

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

### Клиент

```bash
# 1. Перейти в клиентскую часть
cd ../client

# 2. Установить зависимости
pnpm install

# 3. Создать .env на основе шаблона
cp .env.example .env

# 4. Запустить в режиме разработки
pnpm dev
```

Клиент будет доступен на `http://localhost:3000`. В `.env` переменная `SERVER_URL` указывает на адрес API (`http://localhost:4000` по умолчанию).

## 📮 Тестирование API

В папке [`bruno/`](bruno/) лежит готовая коллекция запросов для [Bruno](https://www.usebruno.com/) — с папками `auth` и `user` и окружением `SERVER`:

1. Откройте папку `bruno/` как коллекцию в Bruno
2. Выберите окружение **SERVER** — все URL уже настроены через `{{BASE_URL}}`
3. Выполняйте запросы (регистрация, вход, logout, 2FA, восстановление пароля, профиль)

## 📁 Структура проекта

```
authorization-template/
├── client/               # Next.js клиент (App Router)
│   ├── src/
│   │   ├── app/          # маршруты и layout
│   │   └── shared/       # провайдеры, UI-компоненты, утилиты
│   └── .env.example      # SERVER_URL и другие переменные клиента
├── server/               # NestJS API
│   ├── prisma/           # схема БД и сгенерированный Prisma Client
│   ├── src/
│   │   ├── auth/         # аутентификация, сессии, guards
│   │   ├── user/         # пользователи
│   │   ├── libs/         # общие утилиты
│   │   └── main.ts       # точка входа, сессии, CORS
│   └── docker-compose.yml
└── bruno/                # API-коллекция для Bruno (auth, user)
```
