const mongoose = require('mongoose');

const RetroBoardSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    sprintId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sprint'
    },
    columns: [{
        title: { type: String, required: true }, // e.g., "Well", "Wrong", "Improve"
        cards: [{
            text: { type: String, required: true },
            author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            isAnonymous: { type: Boolean, default: true },
            votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
            sentiment: { type: String } // Added by local keyword analyzer
        }]
    }],
    actionItems: [{
        text: { type: String, required: true },
        type: { type: String, enum: ['process', 'backlog', 'strategy'] },
        status: { type: String, enum: ['proposed', 'approved', 'in-progress', 'completed'], default: 'proposed' },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        linkedTaskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RetroBoard', RetroBoardSchema);
