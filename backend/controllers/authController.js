const bcrypt = require('bcryptjs');
const { db } = require('../database');
const { generateToken } = require('../auth/jwt_token');

// Регистрация нового пользователя
const register = async (req, res) => {
  const { username, email, password, full_name, role } = req.body;

  // Валидация входных данных
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Имя пользователя, email и пароль обязательны' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Пароль должен содержать минимум 6 символов' });
  }

  try {
    // Проверка существования пользователя
    db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (row) {
        return res.status(400).json({ error: 'Пользователь с таким именем или email уже существует' });
      }

      // Хеширование пароля
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Создание пользователя
      db.run(
        'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, full_name || null, role || 'user'],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          // Генерация токена
          const token = generateToken({
            id: this.lastID,
            username,
            email,
            role: role || 'user'
          });

          res.status(201).json({
            message: 'Пользователь зарегистрирован успешно',
            token,
            user: {
              id: this.lastID,
              username,
              email,
              full_name: full_name || null,
              role: role || 'user'
            }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при регистрации пользователя' });
  }
};

// Вход пользователя
const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Имя пользователя и пароль обязательны' });
  }

  // Поиск пользователя по имени пользователя или email
  db.get(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [username, username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(401).json({ error: 'Неверные учетные данные' });
      }

      try {
        // Проверка пароля
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Неверные учетные данные' });
        }

        // Генерация токена
        const token = generateToken({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        });

        // Обновление времени последнего входа
        db.run('UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

        res.json({
          message: 'Вход выполнен успешно',
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            role: user.role
          }
        });
      } catch (error) {
        res.status(500).json({ error: 'Ошибка при входе в систему' });
      }
    }
  );
};

// Получение профиля текущего пользователя
const getProfile = (req, res) => {
  const userId = req.user.id;

  db.get(
    'SELECT id, username, email, full_name, role, created_at, updated_at FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      res.json({ user });
    }
  );
};

// Обновление профиля пользователя
const updateProfile = (req, res) => {
  const userId = req.user.id;
  const { full_name, email } = req.body;

  if (!full_name && !email) {
    return res.status(400).json({ error: 'Необходимо указать данные для обновления' });
  }

  let query = 'UPDATE users SET updated_at = CURRENT_TIMESTAMP';
  let params = [];

  if (full_name) {
    query += ', full_name = ?';
    params.push(full_name);
  }

  if (email) {
    query += ', email = ?';
    params.push(email);
  }

  query += ' WHERE id = ?';
  params.push(userId);

  db.run(query, params, function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Email уже используется другим пользователем' });
      }
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ message: 'Профиль обновлен успешно' });
  });
};

// Изменение пароля
const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Текущий и новый пароль обязательны' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Новый пароль должен содержать минимум 6 символов' });
  }

  try {
    // Получение текущего пароля пользователя
    db.get('SELECT password FROM users WHERE id = ?', [userId], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      // Проверка текущего пароля
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: 'Неверный текущий пароль' });
      }

      // Хеширование нового пароля
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Обновление пароля
      db.run(
        'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [hashedNewPassword, userId],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          res.json({ message: 'Пароль изменен успешно' });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при изменении пароля' });
  }
};

// Получение всех пользователей (только для администраторов)
const getAllUsers = (req, res) => {
  db.all(
    'SELECT id, username, email, full_name, role, created_at, updated_at FROM users ORDER BY created_at DESC',
    (err, users) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ users });
    }
  );
};

// Удаление пользователя (только для администраторов)
const deleteUser = (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user.id;

  if (parseInt(id) === currentUserId) {
    return res.status(400).json({ error: 'Нельзя удалить собственную учетную запись' });
  }

  db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ message: 'Пользователь удален успешно' });
  });
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  deleteUser
}; 