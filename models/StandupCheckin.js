const mongoose = require('mongoose');

const StandupCheckinSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    date: {
        type: String, // YYYY-MM-DD for uniqueness checks
        required: true
    },
    yesterday: {
        type: String,
        required: true
    },
    today: {
        type: String,
        required: true
    },
    blockers: {
        type: String
    },
    hasBlocker: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('StandupCheckin', StandupCheckinSchema);
