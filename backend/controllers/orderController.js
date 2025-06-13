const { db } = require('../database');

// Получить все заказы с информацией о клиентах
const getAllOrders = (req, res) => {
  const query = `
    SELECT o.*, c.name as client_name, c.phone as client_phone
    FROM orders o 
    LEFT JOIN clients c ON o.client_id = c.id 
    ORDER BY o.created_at DESC
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};

// Получить заказ по ID с деталями
const getOrderById = (req, res) => {
  const { id } = req.params;
  
  const orderQuery = `
    SELECT o.*, c.name as client_name, c.phone as client_phone, c.address as client_address
    FROM orders o 
    LEFT JOIN clients c ON o.client_id = c.id 
    WHERE o.id = ?
  `;
  
  const itemsQuery = `
    SELECT of.*, f.name as furniture_name, f.type as furniture_type
    FROM order_furniture of
    LEFT JOIN furniture f ON of.furniture_id = f.id
    WHERE of.order_id = ?
  `;
  
  db.get(orderQuery, [id], (err, order) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!order) {
      res.status(404).json({ error: 'Заказ не найден' });
      return;
    }
    
    db.all(itemsQuery, [id], (err, items) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.json({
        ...order,
        items: items
      });
    });
  });
};

// Создать новый заказ
const createOrder = (req, res) => {
  const { client_id, date, status, items } = req.body;
  
  if (!client_id || !date || !items || items.length === 0) {
    res.status(400).json({ error: 'ID клиента, дата и товары обязательны' });
    return;
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // Создаем заказ
    db.run(
      'INSERT INTO orders (client_id, date, status) VALUES (?, ?, ?)',
      [client_id, date, status || 'pending'],
      function(err) {
        if (err) {
          db.run('ROLLBACK');
          res.status(500).json({ error: err.message });
          return;
        }
        
        const orderId = this.lastID;
        let totalAmount = 0;
        let itemsProcessed = 0;
        
        // Добавляем товары в заказ
        items.forEach(item => {
          const { furniture_id, quantity, price } = item;
          
          db.run(
            'INSERT INTO order_furniture (order_id, furniture_id, quantity, price) VALUES (?, ?, ?, ?)',
            [orderId, furniture_id, quantity, price],
            function(err) {
              if (err) {
                db.run('ROLLBACK');
                res.status(500).json({ error: err.message });
                return;
              }
              
              totalAmount += quantity * price;
              itemsProcessed++;
              
              // Если все товары обработаны, обновляем общую сумму
              if (itemsProcessed === items.length) {
                db.run(
                  'UPDATE orders SET total_amount = ? WHERE id = ?',
                  [totalAmount, orderId],
                  function(err) {
                    if (err) {
                      db.run('ROLLBACK');
                      res.status(500).json({ error: err.message });
                      return;
                    }
                    
                    db.run('COMMIT');
                    res.status(201).json({
                      id: orderId,
                      client_id,
                      date,
                      status: status || 'pending',
                      total_amount: totalAmount,
                      message: 'Заказ создан успешно'
                    });
                  }
                );
              }
            }
          );
        });
      }
    );
  });
};

// Обновить статус заказа
const updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    res.status(400).json({ error: 'Статус обязателен' });
    return;
  }

  db.run(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Заказ не найден' });
        return;
      }
      res.json({ message: 'Статус заказа обновлен успешно' });
    }
  );
};

// Удалить заказ
const deleteOrder = (req, res) => {
  const { id } = req.params;

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // Удаляем товары заказа
    db.run('DELETE FROM order_furniture WHERE order_id = ?', [id], function(err) {
      if (err) {
        db.run('ROLLBACK');
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Удаляем сам заказ
      db.run('DELETE FROM orders WHERE id = ?', [id], function(err) {
        if (err) {
          db.run('ROLLBACK');
          res.status(500).json({ error: err.message });
          return;
        }
        
        if (this.changes === 0) {
          db.run('ROLLBACK');
          res.status(404).json({ error: 'Заказ не найден' });
          return;
        }
        
        db.run('COMMIT');
        res.json({ message: 'Заказ удален успешно' });
      });
    });
  });
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder
}; 