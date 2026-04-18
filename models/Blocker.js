const mongoose = require('mongoose');

const BlockerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ['P0', 'P1', 'P2'],
        required: true
    },
    status: {
        type: String,
        enum: ['reported', 'investigating', 'resolving', 'resolved'],
        default: 'reported'
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Typically SM or Lead assigned to resolve it
    },
    dependencies: [{
        type: String
    }],
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    escalated: {
        type: Boolean,
        default: false
    },
    escalatedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    resolvedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual for SLA tracking
BlockerSchema.virtual('ageInHours').get(function() {
    const end = this.resolvedAt || new Date();
    return Math.abs(end - this.createdAt) / 36e5;
});

module.exports = mongoose.model('Blocker', BlockerSchema);
