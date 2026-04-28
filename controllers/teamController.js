const User = require('../models/User');
const Organization = require('../models/Organization');
const bcrypt = require('bcryptjs');

/**
 * @desc    Get all team members in organization with filtering
 * @route   GET /api/v1/organizations/team
 * @access  Private
 */
exports.getTeam = async (req, res) => {
    try {
        const { type } = req.query;
        let query = { orgId: req.user.orgId };

        const scrumRoles = ['product_owner', 'product_manager', 'developer', 'scrum_master'];
        const legacyRoles = ['owner', 'admin', 'lead', 'contributor', 'client', 'intern'];

        if (type === 'scrum') {
            query.role = { $in: scrumRoles };
        } else if (type === 'legacy') {
            query.role = { $in: legacyRoles };
        }

        const users = await User.find(query).select('-password');
        
        const usersWithRoleType = users.map(u => {
            const userObj = u.toObject();
            userObj.roleType = scrumRoles.includes(u.role) ? 'scrum' : 'legacy';
            return userObj;
        });

        res.json(usersWithRoleType);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @desc    Create a new user manually (Admin/Owner only)
 * @route   POST /api/v1/organizations/users/create
 * @access  Private (Admin/Owner)
 */
exports.createOrgUser = async (req, res) => {
    try {
        // Step 1: Restriction check
        if (req.user.role !== 'owner' && req.user.role !== 'admin' && req.user.role !== 'Admin') {
            return res.status(403).json({ msg: 'Unauthorized: Only Admins can create users directly' });
        }

        const { name, email, role, department, password, jobTitle } = req.body;

        // Step 2: Check organization limit
        const org = await Organization.findById(req.user.orgId);
        if (!org) {
            return res.status(404).json({ msg: 'Organization not found' });
        }

        const userCount = await User.countDocuments({ orgId: req.user.orgId });
        if (userCount >= (org.maxUsers || 20)) {
            return res.status(400).json({ msg: `Organization user limit reached (${org.maxUsers || 20}). Upgrade your plan for more seats.` });
        }

        // Step 3: Check if user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Step 4: Handle Password
        const generatedPassword = password || Math.random().toString(36).slice(-8);

        // Step 5: Map Legacy Role back for API compatibility if needed (but we use the new role directly)
        const scrumRoles = ['product_owner', 'product_manager', 'developer', 'scrum_master'];
        const legacyMapping = {
            'product_owner': 'admin',
            'product_manager': 'lead',
            'developer': 'contributor',
            'scrum_master': 'lead'
        };

        const newUser = new User({
            name,
            email,
            role: role.toLowerCase(),
            password: generatedPassword,
            orgId: req.user.orgId,
            department,
            jobTitle,
            status: 'active',
            roleVersion: 2,
            legacyRole: legacyMapping[role.toLowerCase()] || role.toLowerCase()
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: `User created with role: ${role}`,
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                roleType: scrumRoles.includes(newUser.role) ? 'scrum' : 'legacy',
                generatedPassword: generatedPassword, // We return the plain password once for the admin
                loginUrl: `${req.protocol}://${req.get('host')}/login`
            }
        });

    } catch (err) {
        console.error('Create User Error:', err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};
