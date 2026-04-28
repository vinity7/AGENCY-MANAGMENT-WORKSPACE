const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    assignedMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    teamLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    milestones: [{
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
        deadline: { type: Date }
    }],
    dueDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'On Hold'],
        default: 'Pending',
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    feedback: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        type: { type: String, enum: ['comment', 'Technical Constraint', 'Requirement Gap', 'rejection'] },
        createdAt: { type: Date, default: Date.now }
    }],
    dodChecklist: [{
        item: { type: String, required: true },
        completed: { type: Boolean, default: false }
    }],
    reach: { type: Number, default: 0 },
    impact: { type: Number, default: 0 },
    confidence: { type: Number, default: 100 }, // Percentage
    effort: { type: Number, default: 1 },
    riceScore: { type: Number, default: 0 },
    invoiced: { type: Boolean, default: false },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Task', TaskSchema);

