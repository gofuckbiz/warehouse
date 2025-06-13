const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initDatabase } = require('./database');

// Импорт маршрутов
const supplierRoutes = require('./routes/suppliers');
const clientRoutes = require('./routes/clients');
const furnitureRoutes = require('./routes/furniture');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Маршруты API
app.use('/api/suppliers', supplierRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/furniture', furnitureRoutes);
app.use('/api/orders', orderRoutes);

// Базовый маршрут
app.get('/', (req, res) => {
  res.json({
    message: 'API системы учета мебельного склада',
    version: '1.0.0',
    endpoints: {
      suppliers: '/api/suppliers',
      clients: '/api/clients',
      furniture: '/api/furniture',
      orders: '/api/orders'
    }
  });
});

// Обработка ошибок 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Глобальная обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Инициализация базы данных и запуск сервера
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
      console.log(`API доступно по адресу: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Ошибка инициализации базы данных:', err);
    process.exit(1);
  }); 