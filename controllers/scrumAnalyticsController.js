const Sprint = require('../models/Sprint');
const Task = require('../models/Task');
const Blocker = require('../models/Blocker');

// @desc    Unified metrics for specific roles
// @route   GET /api/v1/analytics/unified
// @access  Private
exports.getUnifiedMetrics = async (req, res) => {
    try {
        const { role } = req.query;
        const orgId = req.user.orgId;

        // Common data
        const sprints = await Sprint.find({ orgId }).sort({ startDate: -1 });
        const blockers = await Blocker.find({ organizationId: orgId });

        let result = {
            sprintsCount: sprints.length,
            activeBlockers: blockers.filter(b => b.status !== 'resolved').length
        };

        if (role === 'pm') {
            result.strategicAlignment = '85%';
            result.roadmapProgress = '42%';
        } else if (role === 'po') {
            result.backlogHealth = 'Healthy';
            result.velocity = 38; // Mock avg velocity
        } // ... etc

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Predictive sprint completion
// @route   GET /api/v1/analytics/predictions/project/:projectId
// @access  Private
exports.getPredictions = async (req, res) => {
    try {
        // Simplified Logic: Velocity vs Remaining Points
        const sprints = await Sprint.find({ orgId: req.user.orgId, status: 'completed' });
        const avgVelocity = sprints.length ? sprints.reduce((acc, s) => acc + s.capacity, 0) / sprints.length : 40;

        const openTasks = await Task.find({ project: req.params.projectId, status: { $ne: 'Completed' } });
        const remainingPoints = openTasks.length * 5; // Simplified: 5 pts per task

        const probability = (avgVelocity / remainingPoints) * 100;

        res.json({
            probability: Math.min(Math.round(probability), 100),
            suggestedAction: probability < 70 ? 'Reduce scope or increase capacity' : 'On track'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};
