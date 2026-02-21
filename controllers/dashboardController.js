const Client = require('../models/Client');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Invoice = require('../models/Invoice');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Public (Should be Private in production)
exports.getDashboardStats = async (req, res) => {
    try {
        const clientsCount = await Client.countDocuments();
        const projectsCount = await Project.countDocuments();
        const tasksCount = await Task.countDocuments();
        const invoicesCount = await Invoice.countDocuments();

        const pendingTasks = await Task.countDocuments({ status: 'Pending' });
        const completedTasks = await Task.countDocuments({ status: 'Completed' });

        const activeProjects = await Project.find().limit(5).sort({ createdAt: -1 });
        const recentTasks = await Task.find().populate('project', 'name').limit(5).sort({ createdAt: -1 });

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
