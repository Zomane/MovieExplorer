# MovieExplorer

Full-stack приложение для поиска фильмов, создания личной коллекции и просмотра профилей других пользователей. Проект включает клиент на Next.js и REST API с JWT авторизацией

## Demo

- Live: https://movie.goodwaitik.tech
- Backend/API: https://api.movie.goodwaitik.tech
- Repository: [github.com/Zomane/MovieExplorer](https://github.com/Zomane/MovieExplorer)

## Screenshots

Скриншоты будут добавлены позже.

## Features

- просмотр каталога и отдельных страниц фильмов
- поиск фильмов и пользователей с сохранением запроса в URL
- регистрация и вход в аккаунт
- JWT-авторизация и защищённые API-маршруты
- добавление фильмов в избранное с optimistic update
- просмотр профилей и коллекций других пользователей
- изменение логина и пароля
- удаление аккаунта
- состояния загрузки, ошибок и страница 404

## Tech Stack

**Frontend:**

- Next.js
- React
- TypeScript
- TanStack Query
- React Hook Form
- CSS Modules

**Backend:**

- Node.js
- Express
- TypeScript
- JSON Web Token
- bcrypt
- CORS и dotenv

## Project Structure

```text
MovieExplorer/
|-- frontend/
|   |-- app/          # страницы и маршруты Next.js App Router
|   |-- api/          # запросы к REST API
|   |-- components/   # UI-компоненты
|   |-- hooks/        # TanStack Query hooks и mutations
|   |-- providers/    # авторизация и QueryClient
|   |-- public/       # изображения и иконки
|   `-- types/        # TypeScript типы клиентской части
`-- backend/
    `-- src/
        |-- server.ts # Express API и middleware
        `-- types/    # TypeScript типы серверной части
```

## Getting Started

### Clone Repository

```bash
git clone https://github.com/Zomane/MovieExplorer.git
cd MovieExplorer
```

### Install Dependencies

```bash
cd frontend
npm install

cd ../backend
npm install
```

### Environment Variables

Создайте файл `backend/.env` по примеру:

```env
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:3000
PORT=3001
```

И файл `frontend/.env` по примеру:

```env
NEXT_PUBLIC_API_URL = http://localhost:3001
```

### Run Project

Запустите backend:

```bash
cd backend
npm run dev
```

В отдельном терминале запустите frontend:

```bash
cd frontend
npm run dev
```

Frontend будет доступен по адресу `http://localhost:3000`, backend — `http://localhost:3001`.

## Scripts

**Frontend:**

- `npm run dev` — запуск в режиме разработки
- `npm run build` — production-сборка
- `npm run start` — запуск production-сборки
- `npm run lint` — проверка ESLint

**Backend:**

- `npm run dev` — запуск API через ts-node
- `npm run build` — компиляция TypeScript
- `npm run start` — запуск скомпилированного API

## Future Improvements

- подключить базу данных + Redis вместо хранения данных в памяти
- добавить unit и integration тесты
- сделать админ панель для добавления/изменения/удаления фильмов
