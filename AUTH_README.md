# Система авторизации - Мебельный склад

## Обзор

Система авторизации реализована с использованием JWT токенов и включает в себя:
- Регистрацию и вход пользователей
- Защищенные маршруты
- Управление профилем
- Роли пользователей (user/admin)
- Хеширование паролей с bcrypt

## Структура файлов

### Backend
```
backend/
├── auth/
│   └── jwt_token.js          # JWT утилиты и middleware
├── controllers/
│   └── authController.js     # Контроллер авторизации
├── routes/
│   └── auth.js              # Маршруты авторизации
├── scripts/
│   └── createAdmin.js       # Скрипт создания администратора
└── database.js              # Обновлена с таблицей users
```

### Frontend
```
frontend/src/
├── contexts/
│   └── AuthContext.js       # React контекст для авторизации
├── components/
│   ├── Login.js            # Компонент входа
│   ├── Register.js         # Компонент регистрации
│   └── Profile.js          # Управление профилем
├── services/
│   └── api.js              # Обновлен с API авторизации
└── App.js                  # Обновлен с защищенными маршрутами
```

## API Endpoints

### Публичные (не требуют авторизации)
- `POST /api/auth/register` - Регистрация нового пользователя
- `POST /api/auth/login` - Вход пользователя

### Защищенные (требуют токен)
- `GET /api/auth/profile` - Получить профиль текущего пользователя
- `PUT /api/auth/profile` - Обновить профиль пользователя
- `POST /api/auth/change-password` - Изменить пароль

### Административные (требуют роль admin)
- `GET /api/auth/users` - Получить всех пользователей
- `DELETE /api/auth/users/:id` - Удалить пользователя

## Использование

### 1. Создание администратора
```bash
cd backend
npm run create-admin
```

**Данные администратора по умолчанию:**
- Имя пользователя: `admin`
- Email: `admin@furniture-warehouse.com`
- Пароль: `admin123`

⚠️ **ВАЖНО:** Смените пароль после первого входа!

### 2. Регистрация пользователя

**Запрос:**
```json
POST /api/auth/register
{
  "username": "user1",
  "email": "user1@example.com",
  "password": "password123",
  "full_name": "Иван Иванов"
}
```

**Ответ:**
```json
{
  "message": "Пользователь зарегистрирован успешно",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "user1",
    "email": "user1@example.com",
    "full_name": "Иван Иванов",
    "role": "user"
  }
}
```

### 3. Вход пользователя

**Запрос:**
```json
POST /api/auth/login
{
  "username": "admin",
  "password": "admin123"
}
```

**Ответ:**
```json
{
  "message": "Вход выполнен успешно",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@furniture-warehouse.com",
    "full_name": "Администратор системы",
    "role": "admin"
  }
}
```

### 4. Использование токена

Все защищенные запросы должны включать токен в заголовке:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Структура базы данных

### Таблица users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  full_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Безопасность

### Хеширование паролей
- Используется bcryptjs с salt rounds = 10
- Пароли никогда не хранятся в открытом виде

### JWT токены
- Время жизни: 24 часа (настраивается)
- Секретный ключ: настраивается через переменные окружения
- Автоматическое обновление при истечении

### Валидация
- Минимальная длина пароля: 6 символов
- Уникальность username и email
- Валидация email формата

## Переменные окружения

Создайте файл `.env` в папке backend:
```env
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h
```

## Роли пользователей

### user (по умолчанию)
- Доступ ко всем основным функциям системы
- Управление собственным профилем

### admin
- Все права пользователя
- Просмотр всех пользователей
- Удаление пользователей
- Административные функции

## Frontend интеграция

### AuthContext
Используйте хук `useAuth()` для доступа к функциям авторизации:

```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Необходима авторизация</div>;
  }
  
  return <div>Привет, {user.username}!</div>;
}
```

### Защищенные маршруты
Компонент `ProtectedRoute` автоматически перенаправляет неавторизованных пользователей на страницу входа.

### Автоматическое добавление токена
API клиент автоматически добавляет токен в заголовки всех запросов и обрабатывает ошибки авторизации.

## Тестирование

### Тестовые пользователи
После создания администратора вы можете:
1. Войти как admin (admin/admin123)
2. Создать новых пользователей через регистрацию
3. Тестировать различные роли и права доступа

### Проверка токенов
Используйте [jwt.io](https://jwt.io) для декодирования и проверки JWT токенов.

## Устранение неполадок

### Ошибка "Токен доступа не предоставлен"
- Убедитесь, что токен сохранен в localStorage
- Проверьте формат заголовка Authorization

### Ошибка "Недействительный токен"
- Токен мог истечь (24 часа)
- Войдите в систему заново

### Ошибка подключения к API
- Убедитесь, что backend сервер запущен на порту 5000
- Проверьте CORS настройки
