const Invoice = require('../models/Invoice');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');

// @desc    Create a new invoice
// @route   POST /api/invoices
// @access  Private (Admin only)
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
            orgId: req.user.orgId,
        });

        const invoice = await newInvoice.save();
        res.status(201).json(invoice);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all invoices for organization
// @route   GET /api/invoices
// @access  Private
exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ orgId: req.user.orgId })
            .populate('client', ['name', 'email'])
            .populate('project', ['name', 'status'])
            .sort({ issueDate: -1 });
        res.json(invoices);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get invoice by ID within organization
// @route   GET /api/invoices/:id
// @access  Private
exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, orgId: req.user.orgId })
            .populate('client', ['name', 'email'])
            .populate('project', ['name', 'status']);

        if (!invoice) {
            return res.status(404).json({ msg: 'Invoice not found or access denied' });
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

// @desc    Update invoice within organization
// @route   PUT /api/invoices/:id
// @access  Private (Admin only)
exports.updateInvoice = async (req, res) => {
    try {
        const { client, project, amount, issueDate, dueDate, status } = req.body;

        let invoice = await Invoice.findOne({ _id: req.params.id, orgId: req.user.orgId }).populate('client', ['name']);

        if (!invoice) return res.status(404).json({ msg: 'Invoice not found or access denied' });

        const oldStatus = invoice.status;

        const invoiceFields = {};
        if (client) invoiceFields.client = client;
        if (project) invoiceFields.project = project;
        if (amount) invoiceFields.amount = amount;
        if (issueDate) invoiceFields.issueDate = issueDate;
        if (dueDate) invoiceFields.dueDate = dueDate;
        if (status) invoiceFields.status = status;

        invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            { $set: invoiceFields },
            { new: true }
        ).populate('client', ['name']).populate('project', ['name']);

        // Send Email Notification if status changed to Paid (to Admins of the SAME organization)
        if (status === 'Paid' && oldStatus !== 'Paid') {
            const admins = await User.find({ role: 'admin', orgId: req.user.orgId });
            for (const admin of admins) {
                if (admin.email) {
                    try {
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
                    } catch (emailErr) {
                        console.error(`Failed to send invoice email to ${admin.email}:`, emailErr);
                    }
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

// @desc    Delete invoice within organization
// @route   DELETE /api/invoices/:id
// @access  Private (Admin only)
exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, orgId: req.user.orgId });

        if (!invoice) {
            return res.status(404).json({ msg: 'Invoice not found or access denied' });
        }

        await invoice.deleteOne();
        res.json({ msg: 'Invoice removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Invoice not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Generate invoice from completed uninvoiced tasks
// @route   POST /api/invoices/generate-from-tasks
// @access  Private (Admin only)
exports.generateInvoiceFromTasks = async (req, res) => {
    try {
        const { projectId, clientId, ratePerTask = 100 } = req.body;
        
        const Task = require('../models/Task');
        const Project = require('../models/Project');

        // Find uninvoiced completed tasks
        const tasks = await Task.find({
            project: projectId,
            orgId: req.user.orgId,
            status: 'Completed',
            invoiced: false
        });

        if (tasks.length === 0) {
            return res.status(400).json({ msg: 'No uninvoiced completed tasks found for this project' });
        }

        const amount = tasks.length * ratePerTask;

        const newInvoice = new Invoice({
            client: clientId,
            project: projectId,
            amount,
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            orgId: req.user.orgId,
            status: 'Pending'
        });

        const invoice = await newInvoice.save();

        // Mark tasks as invoiced
        await Task.updateMany(
            { _id: { $in: tasks.map(t => t._id) } },
            { $set: { invoiced: true } }
        );

        res.json(invoice);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
