const mongoose = require('mongoose');

const InitiativeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    businessValue: {
        type: String,
        required: true
    },
    targetQuarter: {
        type: String, // "Q1 2025"
        required: true
    },
    successMetrics: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['draft', 'active', 'completed', 'on-hold'],
        default: 'draft'
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    epics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Epic'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Initiative', InitiativeSchema);
