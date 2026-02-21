const express = require('express');
const router = express.Router();
const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
} = require('../controllers/projectController');

const auth = require('../middleware/auth');
const { admin } = require('../middleware/auth');

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private (Admin only)
router.post('/', auth, admin, createProject);

// @route   GET /api/projects
// @desc    Get all projects
// @access  Private
router.get('/', auth, getProjects);

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', auth, getProjectById);

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Admin only)
router.put('/:id', auth, admin, updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin only)
router.delete('/:id', auth, admin, deleteProject);

module.exports = router;
