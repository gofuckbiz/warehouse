const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');

// GET /api/orders - получить все заказы
router.get('/', getAllOrders);

// GET /api/orders/:id - получить заказ по ID
router.get('/:id', getOrderById);

// POST /api/orders - создать новый заказ
router.post('/', createOrder);

// PATCH /api/orders/:id/status - обновить статус заказа
router.patch('/:id/status', updateOrderStatus);

// DELETE /api/orders/:id - удалить заказ
router.delete('/:id', deleteOrder);

module.exports = router; 