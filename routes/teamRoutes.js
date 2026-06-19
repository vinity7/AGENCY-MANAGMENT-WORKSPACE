const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTeam, createOrgUser } = require('../controllers/teamController');

// @route   GET /api/v1/organizations/team
// @desc    Get all team members
// @access  Private
router.get('/team', auth, getTeam);

// @route   POST /api/v1/organizations/users/create
// @desc    Create a user manually
// @access  Private (Admin only)
router.post('/users/create', auth, (req, res, next) => {
    if (req.user?.role?.toLowerCase() !== 'admin') {
        return res.status(403).json({ msg: 'Access denied: Requires Admin role' });
    }
    next();
}, createOrgUser);

module.exports = router;
