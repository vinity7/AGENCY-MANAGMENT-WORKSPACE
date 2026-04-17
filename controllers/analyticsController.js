const Task = require('../models/Task');
const Project = require('../models/Project');
const Invoice = require('../models/Invoice');
const User = require('../models/User');

// @desc    Get productivity metrics for organization users
// @route   GET /api/analytics/productivity
// @access  Private (Admin)
exports.getProductivity = async (req, res) => {
    try {
        // Leads and Admins both represent the "workforce" in this context
        const users = await User.find({ orgId: req.user.orgId, role: { $ne: 'Client' } });
        
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
