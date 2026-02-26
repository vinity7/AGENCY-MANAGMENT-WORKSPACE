const Task = require('../models/Task');
const Project = require('../models/Project');
const Invoice = require('../models/Invoice');
const User = require('../models/User');

// @desc    Get intern productivity metrics
// @route   GET /api/analytics/productivity
// @access  Private (Admin)
exports.getProductivity = async (req, res) => {
    try {
        const interns = await User.find({ role: 'Intern' });
        const productivity = await Promise.all(interns.map(async (intern) => {
            const completedTasks = await Task.countDocuments({
                assignedTo: intern._id,
                status: 'Completed'
            });
            const pendingTasks = await Task.countDocuments({
                assignedTo: intern._id,
                status: { $ne: 'Completed' }
            });
            return {
                name: intern.name,
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

// @desc    Get revenue forecasting
// @route   GET /api/analytics/revenue
// @access  Private (Admin)
exports.getRevenueForecast = async (req, res) => {
    try {
        const invoices = await Invoice.find();

        const paidRevenue = invoices
            .filter(inv => inv.status === 'Paid')
            .reduce((sum, inv) => sum + inv.amount, 0);

        const pendingRevenue = invoices
            .filter(inv => inv.status === 'Pending')
            .reduce((sum, inv) => sum + inv.amount, 0);

        // Projected from active projects (simple logic: sum of all pending invoices linked or not)
        // For a more complex forecast, we could look at project budgets if they existed.

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

// @desc    Get project metrics
// @route   GET /api/analytics/projects
// @access  Private (Admin)
exports.getProjectMetrics = async (req, res) => {
    try {
        const projects = await Project.find();
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
