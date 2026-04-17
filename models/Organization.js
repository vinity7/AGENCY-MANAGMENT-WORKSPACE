const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    subscriptionTier: {
        type: String,
        enum: ['Free', 'Pro', 'Enterprise'],
        default: 'Free',
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Organization', OrganizationSchema);
