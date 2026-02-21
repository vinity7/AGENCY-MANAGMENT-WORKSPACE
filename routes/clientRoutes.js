const express = require('express');
const router = express.Router();
const {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient,
} = require('../controllers/clientController');

const auth = require('../middleware/auth');
const { admin } = require('../middleware/auth');

// @route   POST /api/clients
// @desc    Create a new client
// @access  Private (Admin only)
router.post('/', auth, admin, createClient);

// @route   GET /api/clients
// @desc    Get all clients
// @access  Private
router.get('/', auth, getClients);

// @route   GET /api/clients/:id
// @desc    Get client by ID
// @access  Private
router.get('/:id', auth, getClientById);

// @route   PUT /api/clients/:id
// @desc    Update client
// @access  Private (Admin only)
router.put('/:id', auth, admin, updateClient);

// @route   DELETE /api/clients/:id
// @desc    Delete client
// @access  Private (Admin only)
router.delete('/:id', auth, admin, deleteClient);

module.exports = router;
