const express = require('express');
const router = express.Router();
const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
} = require('../controllers/projectController');

// @route   POST /api/projects
// @desc    Create a new project
// @access  Public
router.post('/', createProject);

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', getProjects);

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Public
router.get('/:id', getProjectById);

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Public
router.put('/:id', updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Public
router.delete('/:id', deleteProject);

module.exports = router;
