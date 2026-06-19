const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');
const {
    addTaskFeedback,
    acceptTask,
    rejectTask,
    updateTaskState,
    updateTaskRice
} = require('../controllers/scrumTaskController');

router.post('/:taskId/feedback', auth, addTaskFeedback);
router.post('/:taskId/accept', auth, hasPermission('convert_to_backlog'), acceptTask);
router.post('/:taskId/reject', auth, hasPermission('convert_to_backlog'), rejectTask);
router.patch('/:taskId', auth, updateTaskState);
router.put('/:taskId/rice', auth, updateTaskRice);

module.exports = router;
