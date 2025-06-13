const express = require('express');
const router = express.Router();
const {
  getAllFurniture,
  getFurnitureById,
  createFurniture,
  updateFurniture,
  deleteFurniture,
  updateFurnitureQuantity
} = require('../controllers/furnitureController');

// GET /api/furniture - получить всю мебель
router.get('/', getAllFurniture);

// GET /api/furniture/:id - получить мебель по ID
router.get('/:id', getFurnitureById);

// POST /api/furniture - создать новую мебель
router.post('/', createFurniture);

// PUT /api/furniture/:id - обновить мебель
router.put('/:id', updateFurniture);

// PATCH /api/furniture/:id/quantity - обновить количество мебели
router.patch('/:id/quantity', updateFurnitureQuantity);

// DELETE /api/furniture/:id - удалить мебель
router.delete('/:id', deleteFurniture);

module.exports = router; 