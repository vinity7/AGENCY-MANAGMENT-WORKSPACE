const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    issueDate: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Overdue'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
