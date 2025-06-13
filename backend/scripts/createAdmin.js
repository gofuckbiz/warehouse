const bcrypt = require('bcryptjs');
const { db, initDatabase } = require('../database');

const createDefaultAdmin = async () => {
  try {
    // Инициализируем базу данных
    await initDatabase();
    
    // Проверяем, есть ли уже администратор
    db.get('SELECT id FROM users WHERE role = ?', ['admin'], async (err, admin) => {
      if (err) {
        console.error('Ошибка при проверке администратора:', err);
        return;
      }

      if (admin) {
        console.log('Администратор уже существует');
        process.exit(0);
      }

      // Создаем администратора по умолчанию
      const adminData = {
        username: 'admin',
        email: 'admin@furniture-warehouse.com',
        password: 'admin123',
        full_name: 'Администратор системы',
        role: 'admin'
      };

      try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

        db.run(
          'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
          [adminData.username, adminData.email, hashedPassword, adminData.full_name, adminData.role],
          function(err) {
            if (err) {
              console.error('Ошибка при создании администратора:', err);
              return;
            }

            console.log('✅ Администратор создан успешно!');
            console.log('📋 Данные для входа:');
            console.log(`   Имя пользователя: ${adminData.username}`);
            console.log(`   Email: ${adminData.email}`);
            console.log(`   Пароль: ${adminData.password}`);
            console.log('⚠️  ВАЖНО: Смените пароль после первого входа!');
            
            process.exit(0);
          }
        );
      } catch (error) {
        console.error('Ошибка при хешировании пароля:', error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('Ошибка инициализации базы данных:', error);
    process.exit(1);
  }
};

// Запускаем создание администратора
createDefaultAdmin(); 