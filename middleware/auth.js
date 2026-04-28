const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        console.log('Auth Failed: No token provided');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        
        // Ensure orgId and role are present for multi-tenant apps
        if (!req.user.orgId || !req.user.role) {
            console.log('Auth Failed: Token missing orgId or role', req.user);
            return res.status(401).json({ msg: 'Token missing tenant or role information' });
        }
        
        next();
    } catch (err) {
        console.log('Auth Failed: Invalid token', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports.admin = function (req, res, next) {
    const role = req.user?.role?.toLowerCase();
    if (role === 'admin' || role === 'owner') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied: Requires Admin/Owner role' });
    }
};

// testing the new branch 
