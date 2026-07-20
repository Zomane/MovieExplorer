# MovieExplorer

Full-stack приложение для поиска фильмов, создания личной коллекции и просмотра профилей других пользователей. Проект включает клиент на Next.js и REST API с JWT авторизацией

## Демонстрация

- Live: https://movie.goodwaitik.tech (если сайт не загружается, попробуйте включить впн)
- Backend/API: https://api.movie.goodwaitik.tech
- Repository: [github.com/Zomane/MovieExplorer](https://github.com/Zomane/MovieExplorer)

## Скриншоты

<img width="2495" height="1313" alt="image" src="https://github.com/user-attachments/assets/cce424e2-8cf0-46b4-b686-1c56e0dbb3e4" />
<img width="2493" height="1312" alt="image" src="https://github.com/user-attachments/assets/02ea0d83-d03a-4799-b301-766558c8a06a" />
<img width="2494" height="1313" alt="image" src="https://github.com/user-attachments/assets/7e2d643f-a43d-482a-9289-e3eab5eec92b" />
<img width="2494" height="1308" alt="image" src="https://github.com/user-attachments/assets/0c4cd2a3-64b6-422c-8347-e79ad16626a0" />
<img width="2510" height="1311" alt="image" src="https://github.com/user-attachments/assets/7b0ee005-a6cf-49ab-bbfc-0ff3cab1d2ad" />
<img width="2504" height="1313" alt="image" src="https://github.com/user-attachments/assets/649bba75-894e-4c61-b898-737a507d0410" />
<img width="2501" height="1311" alt="image" src="https://github.com/user-attachments/assets/dcd4f10d-81a6-452a-a387-165e40f54f50" />
<img width="2506" height="1316" alt="image" src="https://github.com/user-attachments/assets/cec1bd19-7bba-45dc-9e25-288742696a4c" />
<img width="2511" height="1311" alt="image" src="https://github.com/user-attachments/assets/fa9fc7c4-76ee-4444-8fcc-168e9729bd83" />

## Возможности

- просмотр каталога и отдельных страниц фильмов
- поиск фильмов и пользователей с сохранением запроса в URL
- регистрация и вход в аккаунт
- JWT-авторизация и защищённые API-маршруты
- добавление фильмов в избранное с optimistic update
- просмотр профилей и коллекций других пользователей
- изменение логина и пароля
- удаление аккаунта
- состояния загрузки, ошибок и страница 404

## Технологии

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
- JWT
- bcrypt
- CORS и dotenv

## Структура проекта
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

## Запуск проекта
### Установка зависимостей

```bash
cd frontend
npm install

cd ../backend
npm install
```

### Переменные окружения

Backend использует переменные из `backend/.env.example`
Frontend использует переменные из `frontend/.env.example`

### Запуск приложения

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

## Команды

**Frontend:**
```bash
`npm run dev`
`npm run build`
`npm run start`
`npm run lint`
```

**Backend:**
```bash
`npm run dev`
`npm run build`
`npm run start`
```

## Возможные улучшения

- подключить базу данных + Redis вместо хранения данных в памяти
- добавить unit и integration тесты
- сделать админ панель для добавления/изменения/удаления фильмов
