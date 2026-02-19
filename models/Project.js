const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },
    description: {
        type: String,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
        default: 'Not Started',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Project', ProjectSchema);
