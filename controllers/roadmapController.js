const Initiative = require('../models/Initiative');
const Epic = require('../models/Epic');
const Task = require('../models/Task');

// @desc    Create new initiative
// @route   POST /api/v1/roadmap/initiatives
// @access  Private (PM, Owner, Admin)
exports.createInitiative = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        req.body.organizationId = req.user.orgId;

        const initiative = await Initiative.create(req.body);
        res.status(201).json(initiative);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Get all initiatives for org
// @route   GET /api/v1/roadmap/initiatives
// @access  Private
exports.getInitiatives = async (req, res) => {
    try {
        const initiatives = await Initiative.find({ organizationId: req.user.orgId })
            .populate('epics')
            .sort({ createdAt: -1 });
        res.json(initiatives);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Convert initiative to backlog items
// @route   POST /api/v1/roadmap/initiatives/:id/convert-to-backlog
// @access  Private (PO, Owner, Admin)
exports.convertToBacklog = async (req, res) => {
    try {
        const initiative = await Initiative.findById(req.params.id);
        if (!initiative) return res.status(404).json({ msg: 'Initiative not found' });

        // Logic to create draft epics/tasks based on initiative
        // This is a complex operation, simplified for MVP
        
        // Update initiative status
        initiative.status = 'active';
        await initiative.save();

        res.json({ msg: 'Initiative converted to backlog items successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};
