const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');
const {
    postCheckin,
    getTeamSummary
} = require('../controllers/standupController');

router.post('/check-in', auth, hasPermission('post_standup'), postCheckin);
router.get('/team-summary', auth, hasPermission('create_retro'), getTeamSummary); // SM permission used here

module.exports = router;
