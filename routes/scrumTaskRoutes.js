const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');
const {
    addTaskFeedback,
    acceptTask,
    rejectTask
} = require('../controllers/scrumTaskController');

router.post('/:taskId/feedback', auth, addTaskFeedback);
router.post('/:taskId/accept', auth, hasPermission('convert_to_backlog'), acceptTask); // Using convert_to_backlog permission for PO acceptance
router.post('/:taskId/reject', auth, hasPermission('convert_to_backlog'), rejectTask);

module.exports = router;
