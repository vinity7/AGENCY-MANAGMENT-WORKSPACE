const Invoice = require('../models/Invoice');

// @desc    Create a new invoice
// @route   POST /api/invoices
// @access  Public
exports.createInvoice = async (req, res) => {
    try {
        const { client, project, amount, issueDate, dueDate, status } = req.body;

        const newInvoice = new Invoice({
            client,
            project,
            amount,
            issueDate,
            dueDate,
            status,
        });

        const invoice = await newInvoice.save();
        res.status(201).json(invoice);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Public
exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate('client', ['name', 'email'])
            .populate('project', ['name', 'status'])
            .sort({ issueDate: -1 });
        res.json(invoices);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
// @access  Public
exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate('client', ['name', 'email'])
            .populate('project', ['name', 'status']);

        if (!invoice) {
            return res.status(404).json({ msg: 'Invoice not found' });
        }

        res.json(invoice);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Invoice not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Public
exports.updateInvoice = async (req, res) => {
    try {
        const { client, project, amount, issueDate, dueDate, status } = req.body;

        const invoiceFields = {};
        if (client) invoiceFields.client = client;
        if (project) invoiceFields.project = project;
        if (amount) invoiceFields.amount = amount;
        if (issueDate) invoiceFields.issueDate = issueDate;
        if (dueDate) invoiceFields.dueDate = dueDate;
        if (status) invoiceFields.status = status;

        let invoice = await Invoice.findById(req.params.id);

        if (!invoice) return res.status(404).json({ msg: 'Invoice not found' });

        invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            { $set: invoiceFields },
            { new: true }
        );

        res.json(invoice);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Invoice not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Public
exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ msg: 'Invoice not found' });
        }

        await invoice.deleteOne({ _id: req.params.id });

        res.json({ msg: 'Invoice removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Invoice not found' });
        }
        res.status(500).send('Server Error');
    }
};
