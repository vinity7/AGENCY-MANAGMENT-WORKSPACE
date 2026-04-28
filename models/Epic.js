const mongoose = require('mongoose');

const EpicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    initiativeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Initiative',
        required: true
    },
    status: {
        type: String,
        enum: ['backlog', 'in-progress', 'completed', 'delivered'],
        default: 'backlog'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Epic', EpicSchema);
