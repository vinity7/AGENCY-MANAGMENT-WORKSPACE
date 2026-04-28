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
    // RICE Scoring Fields
    reach: {
        type: Number, // Number of users affected per quarter
        default: 0
    },
    impact: {
        type: Number, // 0.25 (minimal), 0.5 (low), 1 (medium), 2 (high), 3 (massive)
        default: 1
    },
    confidence: {
        type: Number, // 0 to 1 (0% to 100%)
        default: 0.8
    },
    effort: {
        type: Number, // Person-months or story points
        default: 1
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Calculate RICE Score virtual: (Reach * Impact * Confidence) / Effort
InitiativeSchema.virtual('riceScore').get(function() {
    if (this.effort === 0) return 0;
    const score = (this.reach * this.impact * this.confidence) / this.effort;
    return Math.round(score * 10) / 10; // Round to 1 decimal place
});

module.exports = mongoose.model('Initiative', InitiativeSchema);
