const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  deleteUser
} = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../auth/jwt_token');

// Публичные маршруты (не требуют авторизации)
// POST /api/auth/register - регистрация нового пользователя
router.post('/register', register);

// POST /api/auth/login - вход пользователя
router.post('/login', login);

// Защищенные маршруты (требуют авторизации)
// GET /api/auth/profile - получить профиль текущего пользователя
router.get('/profile', authenticateToken, getProfile);

// PUT /api/auth/profile - обновить профиль пользователя
router.put('/profile', authenticateToken, updateProfile);

// POST /api/auth/change-password - изменить пароль
router.post('/change-password', authenticateToken, changePassword);

// Административные маршруты (требуют права администратора)
// GET /api/auth/users - получить всех пользователей
router.get('/users', authenticateToken, requireAdmin, getAllUsers);

// DELETE /api/auth/users/:id - удалить пользователя
router.delete('/users/:id', authenticateToken, requireAdmin, deleteUser);

module.exports = router; 