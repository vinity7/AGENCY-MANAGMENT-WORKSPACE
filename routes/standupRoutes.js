const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');
const {
    postCheckin,
    getTeamSummary
} = require('../controllers/standupController');

router.post('/check-in', auth, hasPermission('post_standup'), postCheckin);
router.post('/', auth, hasPermission('post_standup'), postCheckin);
router.get('/team-summary', auth, getTeamSummary); // Unified read permission check

module.exports = router;
