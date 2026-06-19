const Task = require('../models/Task');
const Project = require('../models/Project');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const Initiative = require('../models/Initiative');
const Sprint = require('../models/Sprint');
const Blocker = require('../models/Blocker');

// @desc    Get operational summary for organization (The "Big 4" Metrics)
// @route   GET /api/analytics/summary
// @access  Private (Admin, Owner, PM)
exports.getOperationalSummary = async (req, res) => {
    try {
        const orgId = req.user.orgId;

        // 1. Business Value (Total Paid Revenue)
        const invoices = await Invoice.find({ orgId });
        const totalRevenue = invoices
            .filter(inv => inv.status === 'Paid')
            .reduce((sum, inv) => sum + inv.amount, 0);

        // 2. Strategic Alignment (% Initiatives Active)
        const initiatives = await Initiative.find({ organizationId: orgId });
        const activeInitiatives = initiatives.filter(i => i.status === 'active').length;
        const alignment = initiatives.length > 0 ? (activeInitiatives / initiatives.length) * 100 : 0;

        // 3. Team Velocity (Avg points per completed sprint)
        const completedSprints = await Sprint.find({ orgId, status: 'completed' });
        let totalPoints = 0;
        completedSprints.forEach(s => {
            s.items.forEach(item => totalPoints += (item.estimate || 0));
        });
        const velocity = completedSprints.length > 0 ? totalPoints / completedSprints.length : 0;

        // 4. SLA Performance (% Blockers Resolved)
        const blockers = await Blocker.find({ organizationId: orgId });
        const resolvedBlockers = blockers.filter(b => b.status === 'resolved').length;
        const sla = blockers.length > 0 ? (resolvedBlockers / blockers.length) * 100 : 0;

        res.json({
            revenue: totalRevenue,
            alignment: Math.round(alignment),
            velocity: Math.round(velocity),
            sla: Math.round(sla)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get productivity metrics for organization users
// @route   GET /api/analytics/productivity
// @access  Private (Admin)
exports.getProductivity = async (req, res) => {
    try {
        // Leads and Admins both represent the "workforce" in this context
        const users = await User.find({ orgId: req.user.orgId, role: { $ne: 'client' } });
        
        const productivity = await Promise.all(users.map(async (user) => {
            const completedTasks = await Task.countDocuments({
                assignedMembers: user._id,
                orgId: req.user.orgId,
                status: 'Completed'
            });
            const pendingTasks = await Task.countDocuments({
                assignedMembers: user._id,
                orgId: req.user.orgId,
                status: { $ne: 'Completed' }
            });
            return {
                name: user.name,
                role: user.role,
                completed: completedTasks,
                pending: pendingTasks
            };
        }));
        res.json(productivity);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get revenue forecasting for organization
// @route   GET /api/analytics/revenue
// @access  Private (Admin only)
exports.getRevenueForecast = async (req, res) => {
    try {
        const invoices = await Invoice.find({ orgId: req.user.orgId });

        const paidRevenue = invoices
            .filter(inv => inv.status === 'Paid')
            .reduce((sum, inv) => sum + inv.amount, 0);

        const pendingRevenue = invoices
            .filter(inv => inv.status === 'Pending')
            .reduce((sum, inv) => sum + inv.amount, 0);

        res.json({
            actual: paidRevenue,
            projected: paidRevenue + pendingRevenue,
            pending: pendingRevenue
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get project metrics for organization
// @route   GET /api/analytics/projects
// @access  Private (Admin or Lead)
exports.getProjectMetrics = async (req, res) => {
    try {
        const projects = await Project.find({ orgId: req.user.orgId });
        const completed = projects.filter(p => p.status === 'Completed').length;
        const inProgress = projects.filter(p => p.status === 'In Progress').length;
        const delayed = projects.filter(p => p.status !== 'Completed' && new Date(p.endDate) < new Date()).length;

        res.json({
            total: projects.length,
            completed,
            inProgress,
            delayed
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
