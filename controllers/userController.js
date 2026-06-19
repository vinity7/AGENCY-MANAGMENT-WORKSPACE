const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Organization = require('../models/Organization');

// @desc    Register a new user (Creates an Organization)
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, organizationName } = req.body;
        console.log('Registering user and organization:', { name, email, organizationName });

        // Diagnostic: Check DB connection
        if (mongoose.connection.readyState !== 1) {
            console.error('Database connection error: Mongoose state is', mongoose.connection.readyState);
            return res.status(500).json({ 
                msg: 'Database connection error', 
                error: 'Mongoose is not connected to MongoDB' 
            });
        }

        if (!organizationName) {
            return res.status(400).json({ msg: 'Organization name is required for registration' });
        }

        let userResult = await User.findOne({ email });

        if (userResult) {
            console.log('Register failed: User already exists');
            return res.status(400).json({ msg: 'User already exists' });
        }

        const user = new User({
            name,
            email,
            password,
            role: 'owner', // The person who registers is always Admin/Owner
        });

        await user.save();
        console.log('User saved successfully');

        const organization = new Organization({
            name: organizationName,
            ownerId: user._id,
            subscriptionTier: 'Free',
        });

        await organization.save();
        console.log('Organization created successfully');

        // Associate user with organization
        user.orgId = organization._id;
        await user.save();

        // Verify JWT Secret existence
        if (!process.env.JWT_SECRET) {
            console.error('CRITICAL ERROR: JWT_SECRET is missing from environment variables.');
            return res.status(500).json({ 
                msg: 'Server configuration error', 
                error: 'JWT_SECRET is required' 
            });
        }

        // Create JWT Payload
        const payload = {
            user: {
                id: user.id,
                role: user.role,
                orgId: user.orgId,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) {
                    console.error('JWT Signing Error:', err);
                    throw err;
                }
                res.status(201).json({ 
                    token, 
                    user: { 
                        id: user.id, 
                        name: user.name, 
                        email: user.email, 
                        role: user.role,
                        orgId: user.orgId
                    } 
                });
            }
        );
    } catch (err) {
        console.error('Registration Catch Error:', err.message);
        res.status(500).json({ 
            msg: 'Registration Server Error', 
            error: err.message || 'Unknown server error'
        });
    }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`Login failed: User ${email} not found`);
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Match password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`Login failed: Password mismatch for ${email}`);
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Create JWT Payload
        const payload = {
            user: {
                id: user.id,
                role: user.role,
                orgId: user.orgId,
            },
        };

        // Sign Token
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is missing from environment');
        }

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '10h' }
        );

        console.log(`Login successful: ${email} (${user.role})`);
        res.json({ 
            token, 
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role,
                orgId: user.orgId
            } 
        });

    } catch (err) {
        console.error('CRITICAL LOGIN ERROR:', err);
        res.status(500).json({ 
            msg: 'Login Server Error', 
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

// @desc    Get all users in the organization
// @route   GET /api/users/org-users
// @access  Private
exports.getOrgUsers = async (req, res) => {
    try {
        const users = await User.find({ orgId: req.user.orgId }).select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Forgot Password
// @route   POST /api/users/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: 'User with this email does not exist' });
        }

        console.log(`Password reset requested for ${email}. Mock link: http://localhost:5173/reset-password?email=${email}`);

        res.json({ msg: 'Password reset instructions sent to your email.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Reset Password
// @route   POST /api/users/reset-password
// @access  Private
exports.resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        
        // Find user by authenticated req.user.id
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ msg: 'Password has been reset successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Invite/Create a sub-user (Admin only)
// @route   POST /api/users/invite
// @access  Private (Admin)
exports.inviteUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        
        // Only Admin/Owner can invite
        const callerRole = req.user.role?.toLowerCase();
        if (callerRole !== 'admin' && callerRole !== 'owner') {
            return res.status(403).json({ msg: 'Unauthorized: Only Admins can invite users' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Generate temporary password
        const tempPassword = Math.random().toString(36).slice(-8);
        console.log(`Generated temporary password for ${email}: ${tempPassword}`);

        user = new User({
            name,
            email,
            password: tempPassword,
            role, // 'Lead' or 'Client'
            orgId: req.user.orgId, // Associate with current Admin's org
        });

        await user.save();

        res.status(201).json({ 
            msg: 'User invited successfully', 
            user: { id: user.id, name, email, role, orgId: user.orgId },
            tempPassword // Returning it for demo purposes
        });
    } catch (err) {
        console.error('Invite Error:', err.message);
        res.status(500).send('Server Error');
    }
};
