const Blocker = require('../models/Blocker');
const socketUtil = require('../utils/socket');

// @desc    Report new blocker
// @route   POST /api/v1/blockers
// @access  Private (Contributor, Dev, SM)
exports.reportBlocker = async (req, res) => {
    try {
        req.body.reporter = req.user.id;
        req.body.organizationId = req.user.orgId;

        const blocker = await Blocker.create(req.body);
        
        // Real-time notification for P0 blockers
        if (blocker.severity === 'P0') {
            const io = socketUtil.getIO();
            io.to(req.user.orgId.toString()).emit('critical-blocker', {
                msg: `CRITICAL P0 BLOCKER: ${blocker.title}`,
                blockerId: blocker._id
            });
        }

        res.status(201).json(blocker);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Get blockers for org
// @route   GET /api/v1/blockers
// @access  Private
exports.getBlockers = async (req, res) => {
    try {
        const blockers = await Blocker.find({ organizationId: req.user.orgId })
            .populate('reporter', 'name role')
            .populate('owner', 'name role')
            .sort({ createdAt: -1 });
        res.json(blockers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Escalate blocker
// @route   POST /api/v1/blockers/:id/escalate
// @access  Private (PO, SM)
exports.escalateBlocker = async (req, res) => {
    try {
        const blocker = await Blocker.findById(req.params.id);
        if (!blocker) return res.status(404).json({ msg: 'Blocker not found' });

        blocker.escalated = true;
        // In a real app, logic to find PO/PM would go here
        await blocker.save();

        res.json(blocker);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};
