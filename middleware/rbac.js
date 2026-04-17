/**
 * Role-Based Access Control Middleware
 */

// Allow only specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                msg: `Role '${req.user?.role}' is not authorized to access this resource`
            });
        }
        next();
    };
};

// Specialized middleware for "Financial Center" access
exports.canAccessFinancials = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied: Only Admins can access financial data' });
    }
};

// Specialized middleware for Client Portal (Read-only)
exports.isClientStakeholder = (req, res, next) => {
    if (req.user && req.user.role === 'Client') {
        // Here we could enforce read-only if it's a GET request, but for now we just check role
        next();
    } else {
        res.status(403).json({ msg: 'Access denied: Only Client stakeholders can access this portal' });
    }
};
