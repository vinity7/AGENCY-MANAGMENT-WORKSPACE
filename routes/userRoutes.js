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

// @route   POST /api/users/forgot-password
// @desc    Forgot password
// @access  Public
router.post('/forgot-password', require('../controllers/userController').forgotPassword);

// @route   POST /api/users/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password', require('../controllers/userController').resetPassword);


module.exports = router;
