const mongoose = require('mongoose');

const SprintSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    goal: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    capacity: {
        type: Number, // in points or hours
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: ['planning', 'active', 'completed', 'review'],
        default: 'planning'
    },
    items: [{
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        },
        estimate: {
            type: Number,
            default: 0
        },
        atRisk: {
            type: Boolean,
            default: false
        },
        poOverride: {
            type: Boolean,
            default: false
        }
    }],
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Sprint', SprintSchema);
