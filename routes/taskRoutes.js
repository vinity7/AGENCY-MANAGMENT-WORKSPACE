const express = require('express');
const router = express.Router();
const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatus,
} = require('../controllers/taskController');

const auth = require('../middleware/auth');
const { admin } = require('../middleware/auth');

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private (Admin only)
router.post('/', auth, admin, createTask);

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Private
router.get('/', auth, getTasks);

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get('/:id', auth, getTaskById);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private (Admin only)
router.put('/:id', auth, admin, updateTask);

// @route   PATCH /api/tasks/:id/status
// @desc    Update task status
// @access  Private
router.patch('/:id/status', auth, updateTaskStatus);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private (Admin only)
router.delete('/:id', auth, admin, deleteTask);

module.exports = router;
