const express = require('express');
const router = express.Router();
const {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient,
} = require('../controllers/clientController');

// @route   POST /api/clients
// @desc    Create a new client
// @access  Public
router.post('/', createClient);

// @route   GET /api/clients
// @desc    Get all clients
// @access  Public
router.get('/', getClients);

// @route   GET /api/clients/:id
// @desc    Get client by ID
// @access  Public
router.get('/:id', getClientById);

// @route   PUT /api/clients/:id
// @desc    Update client
// @access  Public
router.put('/:id', updateClient);

// @route   DELETE /api/clients/:id
// @desc    Delete client
// @access  Public
router.delete('/:id', deleteClient);

module.exports = router;
