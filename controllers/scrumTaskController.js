const Task = require('../models/Task');
const Sprint = require('../models/Sprint');

// @desc    Add feedback to task
// @route   POST /api/v1/tasks/:taskId/feedback
// @access  Private
exports.addTaskFeedback = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Add feedback entry to task (Update Task model if needed)
        // For MVP, using a simple comment-like structure
        if (!task.feedback) task.feedback = [];
        task.feedback.push({
            user: req.user.id,
            text: req.body.text,
            type: req.body.type || 'comment', // 'Technical Constraint' vs 'Requirement Gap'
            createdAt: new Date()
        });

        await task.save();
        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Accept task (PO only)
// @route   POST /api/v1/tasks/:taskId/accept
// @access  Private (PO)
exports.acceptTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        task.status = 'Completed';
        await task.save();

        res.json({ msg: 'Task accepted and marked as completed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Reject task (PO only)
// @route   POST /api/v1/tasks/:taskId/reject
// @access  Private (PO)
exports.rejectTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        task.status = 'Pending'; // Move back to backlog/doing
        if (!task.feedback) task.feedback = [];
        task.feedback.push({
            user: req.user.id,
            text: `REJECTED: ${req.body.reason}`,
            type: 'rejection',
            createdAt: new Date()
        });

        await task.save();
        res.json({ msg: 'Task rejected and returned to backlog' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};
