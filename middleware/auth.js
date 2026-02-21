const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecrettoken');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports.admin = function (req, res, next) {
    console.log('Checking admin role for user:', req.user);
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        console.log('Admin access denied. Role:', req.user?.role);
        res.status(403).json({ msg: 'Access denied: Requires Admin role' });
    }
};
