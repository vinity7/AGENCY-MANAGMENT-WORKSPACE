const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');
const {
    createSprint,
    getSprints,
    addItemsToSprint,
    markAtRisk
} = require('../controllers/sprintController');

router.post('/', auth, hasPermission('plan_sprint'), createSprint);
router.get('/', auth, getSprints);
router.post('/:id/add-items', auth, hasPermission('plan_sprint'), addItemsToSprint);
router.post('/:id/mark-at-risk/:itemId', auth, hasPermission('plan_sprint'), markAtRisk);

module.exports = router;
