const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');
const {
    reportBlocker,
    getBlockers,
    escalateBlocker,
    resolveBlocker
} = require('../controllers/blockerController');

router.post('/', auth, hasPermission('report_blocker'), reportBlocker);
router.get('/', auth, getBlockers);
router.post('/:id/escalate', auth, hasPermission('escalate_blocker'), escalateBlocker);
router.patch('/:id/resolve', auth, hasPermission('resolve_blocker'), resolveBlocker);

module.exports = router;
