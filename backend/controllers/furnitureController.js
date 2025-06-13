const { db } = require('../database');

// Получить всю мебель с информацией о поставщиках
const getAllFurniture = (req, res) => {
  const query = `
    SELECT f.*, s.name as supplier_name 
    FROM furniture f 
    LEFT JOIN suppliers s ON f.supplier_id = s.id 
    ORDER BY f.created_at DESC
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};

// Получить мебель по ID
const getFurnitureById = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT f.*, s.name as supplier_name 
    FROM furniture f 
    LEFT JOIN suppliers s ON f.supplier_id = s.id 
    WHERE f.id = ?
  `;
  
  db.get(query, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Мебель не найдена' });
      return;
    }
    res.json(row);
  });
};

// Создать новую мебель
const createFurniture = (req, res) => {
  const { name, type, price, quantity, supplier_id } = req.body;
  
  if (!name || !type || !price) {
    res.status(400).json({ error: 'Название, тип и цена обязательны' });
    return;
  }

  db.run(
    'INSERT INTO furniture (name, type, price, quantity, supplier_id) VALUES (?, ?, ?, ?, ?)',
    [name, type, price, quantity || 0, supplier_id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        name,
        type,
        price,
        quantity: quantity || 0,
        supplier_id,
        message: 'Мебель добавлена успешно'
      });
    }
  );
};

// Обновить мебель
const updateFurniture = (req, res) => {
  const { id } = req.params;
  const { name, type, price, quantity, supplier_id } = req.body;

  if (!name || !type || !price) {
    res.status(400).json({ error: 'Название, тип и цена обязательны' });
    return;
  }

  db.run(
    'UPDATE furniture SET name = ?, type = ?, price = ?, quantity = ?, supplier_id = ? WHERE id = ?',
    [name, type, price, quantity, supplier_id, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Мебель не найдена' });
        return;
      }
      res.json({ message: 'Мебель обновлена успешно' });
    }
  );
};

// Удалить мебель
const deleteFurniture = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM furniture WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Мебель не найдена' });
      return;
    }
    res.json({ message: 'Мебель удалена успешно' });
  });
};

// Обновить количество мебели на складе
const updateFurnitureQuantity = (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined || quantity < 0) {
    res.status(400).json({ error: 'Количество должно быть неотрицательным числом' });
    return;
  }

  db.run(
    'UPDATE furniture SET quantity = ? WHERE id = ?',
    [quantity, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Мебель не найдена' });
        return;
      }
      res.json({ message: 'Количество обновлено успешно' });
    }
  );
};

module.exports = {
  getAllFurniture,
  getFurnitureById,
  createFurniture,
  updateFurniture,
  deleteFurniture,
  updateFurnitureQuantity
}; 