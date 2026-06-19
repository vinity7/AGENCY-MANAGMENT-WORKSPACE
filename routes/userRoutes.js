const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const {
    registerUser,
    loginUser,
    getOrgUsers,
    forgotPassword,
    resetPassword,
    inviteUser,
} = require('../controllers/userController');

// @route   POST /api/users/register
// @desc    Register user (and Organization)
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/users/org-users
// @desc    Get all users in organization
// @access  Private
router.get('/org-users', auth, getOrgUsers);

// @route   POST /api/users/forgot-password
// @desc    Forgot password
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   POST /api/users/reset-password
// @desc    Reset password
// @access  Private
router.post('/reset-password', auth, resetPassword);

// @route   POST /api/users/invite
// @desc    Invite/Create a sub-user (Admin only)
// @access  Private (Admin)
router.post('/invite', auth, inviteUser);

module.exports = router;
