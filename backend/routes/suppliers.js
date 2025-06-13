const express = require('express');
const router = express.Router();
const {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');

// GET /api/suppliers - получить всех поставщиков
router.get('/', getAllSuppliers);

// GET /api/suppliers/:id - получить поставщика по ID
router.get('/:id', getSupplierById);

// POST /api/suppliers - создать нового поставщика
router.post('/', createSupplier);

// PUT /api/suppliers/:id - обновить поставщика
router.put('/:id', updateSupplier);

// DELETE /api/suppliers/:id - удалить поставщика
router.delete('/:id', deleteSupplier);

module.exports = router; 