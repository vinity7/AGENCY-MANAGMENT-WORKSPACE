const Client = require('../models/Client');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Invoice = require('../models/Invoice');

// @desc    Get dashboard stats for organization
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        const orgFilter = { orgId: req.user.orgId };

        const clientsCount = await Client.countDocuments(orgFilter);
        const projectsCount = await Project.countDocuments(orgFilter);
        const tasksCount = await Task.countDocuments(orgFilter);
        const invoicesCount = await Invoice.countDocuments(orgFilter);

        const pendingTasks = await Task.countDocuments({ ...orgFilter, status: 'Pending' });
        const completedTasks = await Task.countDocuments({ ...orgFilter, status: 'Completed' });

        const activeProjects = await Project.find(orgFilter).limit(5).sort({ createdAt: -1 });
        const recentTasks = await Task.find(orgFilter).populate('project', 'name').limit(5).sort({ createdAt: -1 });

        res.json({
            counts: {
                clients: clientsCount,
                projects: projectsCount,
                tasks: tasksCount,
                invoices: invoicesCount,
                pendingTasks,
                completedTasks
            },
            activeProjects,
            recentTasks
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
