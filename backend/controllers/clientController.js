const { db } = require('../database');

// Получить всех клиентов
const getAllClients = (req, res) => {
  db.all('SELECT * FROM clients ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};

// Получить клиента по ID
const getClientById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM clients WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Клиент не найден' });
      return;
    }
    res.json(row);
  });
};

// Создать нового клиента
const createClient = (req, res) => {
  const { name, phone, address } = req.body;
  
  if (!name) {
    res.status(400).json({ error: 'Имя клиента обязательно' });
    return;
  }

  db.run(
    'INSERT INTO clients (name, phone, address) VALUES (?, ?, ?)',
    [name, phone, address],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        name,
        phone,
        address,
        message: 'Клиент создан успешно'
      });
    }
  );
};

// Обновить клиента
const updateClient = (req, res) => {
  const { id } = req.params;
  const { name, phone, address } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Имя клиента обязательно' });
    return;
  }

  db.run(
    'UPDATE clients SET name = ?, phone = ?, address = ? WHERE id = ?',
    [name, phone, address, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Клиент не найден' });
        return;
      }
      res.json({ message: 'Клиент обновлен успешно' });
    }
  );
};

// Удалить клиента
const deleteClient = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM clients WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Клиент не найден' });
      return;
    }
    res.json({ message: 'Клиент удален успешно' });
  });
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
}; 