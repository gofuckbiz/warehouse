const express = require('express');
const router = express.Router();
const {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
} = require('../controllers/clientController');

// GET /api/clients - получить всех клиентов
router.get('/', getAllClients);

// GET /api/clients/:id - получить клиента по ID
router.get('/:id', getClientById);

// POST /api/clients - создать нового клиента
router.post('/', createClient);

// PUT /api/clients/:id - обновить клиента
router.put('/:id', updateClient);

// DELETE /api/clients/:id - удалить клиента
router.delete('/:id', deleteClient);

module.exports = router; 