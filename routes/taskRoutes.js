const express = require('express');
const router = express.Router();
const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
} = require('../controllers/taskController');

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Public
router.post('/', createTask);

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Public
router.get('/', getTasks);

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Public
router.get('/:id', getTaskById);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Public
router.put('/:id', updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Public
router.delete('/:id', deleteTask);

module.exports = router;
