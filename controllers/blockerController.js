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
        
        // Notification logic
        const User = require('../models/User');
        const sendEmail = require('../utils/emailService');

        // Real-time notification for P0 blockers
        if (blocker.severity === 'P0' || blocker.severity === 'P1') {
            // Socket.io notification
            const io = socketUtil.getIO();
            io.to(req.user.orgId.toString()).emit('critical-blocker', {
                msg: `CRITICAL ${blocker.severity} BLOCKER: ${blocker.title}`,
                blockerId: blocker._id
            });

            // Email notifications to SMs and Admins
            const notifyList = await User.find({
                orgId: req.user.orgId,
                role: { $in: ['Admin', 'Scrum Master'] }
            });

            for (const user of notifyList) {
                if (user.email) {
                    await sendEmail({
                        email: user.email,
                        subject: `🚨 [ALERT] ${blocker.severity} Blocker: ${blocker.title}`,
                        message: `A new critical blocker has been reported: ${blocker.description}`,
                        html: `<div style="font-family: sans-serif; padding: 20px; background: #fff1f2; border: 1px solid #fda4af; border-radius: 12px;">
                                <h2 style="color: #e11d48; margin-top: 0;">Critical Blocker Reported</h2>
                                <p>A <strong>${blocker.severity}</strong> blocker has been reported by <strong>${req.user.name || 'a team member'}</strong>.</p>
                                <div style="background: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #e11d48;">
                                    <h3 style="margin-top: 0;">${blocker.title}</h3>
                                    <p>${blocker.description}</p>
                                </div>
                                <p style="margin-top: 20px; font-size: 12px; color: #9f1239;">Please check the Blocker Board for immediate resolution.</p>
                              </div>`
                    });
                }
            }
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
