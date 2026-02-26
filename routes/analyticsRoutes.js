const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProductivity, getRevenueForecast, getProjectMetrics } = require('../controllers/analyticsController');

// All routes are private and restricted to Admin
router.get('/productivity', auth, auth.admin, getProductivity);
router.get('/revenue', auth, auth.admin, getRevenueForecast);
router.get('/projects', auth, auth.admin, getProjectMetrics);

module.exports = router;
