const express = require('express');
const router = express.Router();
const {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
} = require('../controllers/invoiceController');

// @route   POST /api/invoices
// @desc    Create a new invoice
// @access  Public
router.post('/', createInvoice);

// @route   GET /api/invoices
// @desc    Get all invoices
// @access  Public
router.get('/', getInvoices);

// @route   GET /api/invoices/:id
// @desc    Get invoice by ID
// @access  Public
router.get('/:id', getInvoiceById);

// @route   PUT /api/invoices/:id
// @desc    Update invoice
// @access  Public
router.put('/:id', updateInvoice);

// @route   DELETE /api/invoices/:id
// @desc    Delete invoice
// @access  Public
router.delete('/:id', deleteInvoice);

module.exports = router;
