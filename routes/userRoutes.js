const express = require('express');
const router = express.Router();
const {
    registerUser,
    getInterns,
} = require('../controllers/userController');

// @route   POST /api/users/register
// @desc    Register user
// @access  Public
router.post('/register', registerUser);

// @route   GET /api/users/interns
// @desc    Get all interns
// @access  Public
router.get('/interns', getInterns);

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', require('../controllers/userController').loginUser);

module.exports = router;
