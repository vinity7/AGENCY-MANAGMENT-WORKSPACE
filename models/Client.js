const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Pending', 'Active', 'Inactive'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Client', ClientSchema);
