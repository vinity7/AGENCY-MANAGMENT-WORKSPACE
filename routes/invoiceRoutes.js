const express = require('express');
const router = express.Router();
const {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
} = require('../controllers/invoiceController');

const auth = require('../middleware/auth');
const { admin } = require('../middleware/auth');

// @route   POST /api/invoices
// @desc    Create a new invoice
// @access  Private (Admin only)
router.post('/', auth, admin, createInvoice);

// @route   GET /api/invoices
// @desc    Get all invoices
// @access  Private
router.get('/', auth, getInvoices);

// @route   GET /api/invoices/:id
// @desc    Get invoice by ID
// @access  Private
router.get('/:id', auth, getInvoiceById);

// @route   PUT /api/invoices/:id
// @desc    Update invoice
// @access  Private (Admin only)
router.put('/:id', auth, admin, updateInvoice);

// @route   DELETE /api/invoices/:id
// @desc    Delete invoice
// @access  Private (Admin only)
router.delete('/:id', auth, admin, deleteInvoice);

module.exports = router;
