const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
    getUnifiedMetrics,
    getPredictions
} = require('../controllers/scrumAnalyticsController');

router.get('/unified', auth, getUnifiedMetrics);
router.get('/predictions/project/:projectId', auth, getPredictions);

module.exports = router;
