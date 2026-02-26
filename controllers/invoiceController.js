const Invoice = require('../models/Invoice');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');

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

        let invoice = await Invoice.findById(req.params.id).populate('client', ['name']);

        if (!invoice) return res.status(404).json({ msg: 'Invoice not found' });

        const oldStatus = invoice.status;

        invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            { $set: invoiceFields },
            { new: true }
        ).populate('client', ['name']).populate('project', ['name']);

        // Send Email Notification if status changed to Paid
        if (status === 'Paid' && oldStatus !== 'Paid') {
            const admins = await User.find({ role: 'Admin' });
            for (const admin of admins) {
                if (admin.email) {
                    await sendEmail({
                        email: admin.email,
                        subject: `Payment Received: Invoice for ${invoice.client?.name}`,
                        message: `The invoice for project "${invoice.project?.name}" has been marked as Paid. Amount: $${invoice.amount}`,
                        html: `
                            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                                <h2 style="color: #059669;">Payment Confirmed</h2>
                                <p>Hello <strong>${admin.name}</strong>,</p>
                                <p>Good news! An invoice has been settled by your client:</p>
                                <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #a7f3d0;">
                                    <h3 style="margin-top: 0; color: #047857;">Invoice for ${invoice.client?.name}</h3>
                                    <p style="margin: 5px 0; color: #047857;">Project: <strong>${invoice.project?.name}</strong></p>
                                    <p style="font-size: 18px; font-weight: bold; color: #047857; margin-bottom: 0;">Amount: $${invoice.amount}</p>
                                </div>
                                <p>This transaction has been recorded in your financial dashboard.</p>
                                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                                <small style="color: #94a3b8;">This is an automated notification from Agency Mgr.</small>
                            </div>
                        `
                    });
                }
            }
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
