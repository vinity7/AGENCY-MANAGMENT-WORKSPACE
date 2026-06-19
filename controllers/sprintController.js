const Sprint = require('../models/Sprint');
const Task = require('../models/Task');

// @desc    Create new sprint
// @route   POST /api/v1/sprints
// @access  Private (PO, SM, Owner, Admin)
exports.createSprint = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        req.body.orgId = req.user.orgId;

        const sprint = await Sprint.create(req.body);
        res.status(201).json(sprint);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Get sprints for org
// @route   GET /api/v1/sprints
// @access  Private
exports.getSprints = async (req, res) => {
    try {
        const sprints = await Sprint.find({ orgId: req.user.orgId })
            .populate('items.taskId')
            .sort({ startDate: -1 });
        res.json(sprints);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Add items to sprint
// @route   POST /api/v1/sprints/:id/add-items
// @access  Private (PO, SM)
exports.addItemsToSprint = async (req, res) => {
    try {
        const { taskIds } = req.body; // Array of { taskId, estimate }
        const sprint = await Sprint.findById(req.params.id);
        
        if (!sprint) return res.status(404).json({ msg: 'Sprint not found' });

        sprint.items.push(...taskIds);
        await sprint.save();

        res.json(sprint);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Mark item as at risk
// @route   POST /api/v1/sprints/:id/mark-at-risk/:itemId
// @access  Private (SM)
exports.markAtRisk = async (req, res) => {
    try {
        const sprint = await Sprint.findById(req.params.id);
        if (!sprint) return res.status(404).json({ msg: 'Sprint not found' });

        const item = sprint.items.id(req.params.itemId);
        if (!item) return res.status(404).json({ msg: 'Item not found in sprint' });

        item.atRisk = true;
        await sprint.save();

        res.json(sprint);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Update sprint details
// @route   PATCH /api/v1/sprints/:id
// @access  Private (PO, SM, Owner, Admin)
exports.updateSprint = async (req, res) => {
    try {
        const sprint = await Sprint.findOneAndUpdate(
            { _id: req.params.id, orgId: req.user.orgId },
            req.body,
            { new: true }
        ).populate('items.taskId');
        if (!sprint) return res.status(404).json({ msg: 'Sprint not found' });
        res.json(sprint);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

