const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'warehouse.db');
const db = new sqlite3.Database(dbPath);

// Инициализация базы данных
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Таблица поставщиков
      db.run(`CREATE TABLE IF NOT EXISTS suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contacts TEXT,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Таблица клиентов
      db.run(`CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Таблица мебели
      db.run(`CREATE TABLE IF NOT EXISTS furniture (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        supplier_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (supplier_id) REFERENCES suppliers (id)
      )`);

      // Таблица заказов
      db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        date DATE NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        total_amount DECIMAL(10,2) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients (id)
      )`);

      // Таблица связи заказов и мебели
      db.run(`CREATE TABLE IF NOT EXISTS order_furniture (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        furniture_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
        FOREIGN KEY (furniture_id) REFERENCES furniture (id)
      )`, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('База данных инициализирована успешно');
          resolve();
        }
      });
    });
  });
};

module.exports = { db, initDatabase }; 