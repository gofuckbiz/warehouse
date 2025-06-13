const { db } = require('../database');

// Получить всех поставщиков
const getAllSuppliers = (req, res) => {
  db.all('SELECT * FROM suppliers ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};

// Получить поставщика по ID
const getSupplierById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM suppliers WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Поставщик не найден' });
      return;
    }
    res.json(row);
  });
};

// Создать нового поставщика
const createSupplier = (req, res) => {
  const { name, contacts, address } = req.body;
  
  if (!name) {
    res.status(400).json({ error: 'Название поставщика обязательно' });
    return;
  }

  db.run(
    'INSERT INTO suppliers (name, contacts, address) VALUES (?, ?, ?)',
    [name, contacts, address],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        name,
        contacts,
        address,
        message: 'Поставщик создан успешно'
      });
    }
  );
};

// Обновить поставщика
const updateSupplier = (req, res) => {
  const { id } = req.params;
  const { name, contacts, address } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Название поставщика обязательно' });
    return;
  }

  db.run(
    'UPDATE suppliers SET name = ?, contacts = ?, address = ? WHERE id = ?',
    [name, contacts, address, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Поставщик не найден' });
        return;
      }
      res.json({ message: 'Поставщик обновлен успешно' });
    }
  );
};

// Удалить поставщика
const deleteSupplier = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM suppliers WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Поставщик не найден' });
      return;
    }
    res.json({ message: 'Поставщик удален успешно' });
  });
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
}; 