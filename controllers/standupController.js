const StandupCheckin = require('../models/StandupCheckin');

// @desc    Post daily standup check-in
// @route   POST /api/v1/standup/check-in
// @access  Private (Contributor, Dev)
exports.postCheckin = async (req, res) => {
    try {
        const { yesterday, today, blockers, hasBlocker } = req.body;
        const date = new Date().toISOString().split('T')[0];

        // Check if already checked in today
        let checkin = await StandupCheckin.findOne({
            userId: req.user.id,
            date
        });

        if (checkin) {
            checkin.yesterday = yesterday;
            checkin.today = today;
            checkin.blockers = blockers;
            checkin.hasBlocker = hasBlocker;
            await checkin.save();
        } else {
            checkin = await StandupCheckin.create({
                userId: req.user.id,
                organizationId: req.user.orgId,
                date,
                yesterday,
                today,
                blockers,
                hasBlocker
            });
        }

        res.status(201).json(checkin);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Get team summary for today
// @route   GET /api/v1/standup/team-summary
// @access  Private (SM, Owner, Admin)
exports.getTeamSummary = async (req, res) => {
    try {
        const date = new Date().toISOString().split('T')[0];
        const checkins = await StandupCheckin.find({
            organizationId: req.user.orgId,
            date
        }).populate('userId', 'name email role');

        res.json(checkins);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};
