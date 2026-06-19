const Task = require('../models/Task');
const Sprint = require('../models/Sprint');

// @desc    Add feedback to task
// @route   POST /api/v1/tasks/:taskId/feedback
// @access  Private
exports.addTaskFeedback = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Add feedback entry to task
        if (!task.feedback) task.feedback = [];
        task.feedback.push({
            user: req.user.id,
            text: req.body.text,
            type: req.body.type || 'comment', // 'Technical Constraint' vs 'Requirement Gap' vs 'comment'
            createdAt: new Date()
        });

        await task.save();
        
        // Populate the user details on the newly added feedback for client sync
        const populatedTask = await Task.findById(task._id).populate('feedback.user', 'name role');
        res.json(populatedTask);
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

        res.json({ msg: 'Task accepted and marked as completed', task });
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
            text: `REJECTED: ${req.body.reason || 'Requirement not satisfied.'}`,
            type: 'rejection',
            createdAt: new Date()
        });

        await task.save();
        res.json({ msg: 'Task rejected and returned to backlog', task });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Update task status, refinementState, & dodChecklist
// @route   PATCH /api/v1/tasks/:taskId
// @access  Private
exports.updateTaskState = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.taskId, orgId: req.user.orgId });
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        const { status, refinementState, dodChecklist } = req.body;
        if (status !== undefined) task.status = status;
        if (refinementState !== undefined) task.refinementState = refinementState;
        if (dodChecklist !== undefined) task.dodChecklist = dodChecklist;

        await task.save();
        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Update task RICE score
// @route   PUT /api/v1/tasks/:taskId/rice
// @access  Private
exports.updateTaskRice = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.taskId, orgId: req.user.orgId });
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        const { reach, impact, confidence, effort } = req.body;

        const r = Number(reach) || 0;
        const i = Number(impact) || 0;
        const c = Number(confidence) || 0;
        const e = Number(effort) || 1;

        task.reach = r;
        task.impact = i;
        task.confidence = c;
        task.effort = e <= 0 ? 1 : e;
        task.riceScore = (r * i * (c / 100)) / task.effort;

        await task.save();
        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};
