// Unified permission check
exports.hasPermission = (action) => {
    return (req, res, next) => {
        const userRole = req.user?.role?.toLowerCase();
        
        const matrix = {
            create_initiative: ['product_manager', 'owner', 'admin'],
            convert_to_backlog: ['product_owner', 'owner', 'admin'],
            plan_sprint: ['product_owner', 'scrum_master', 'owner', 'admin'],
            override_capacity: ['product_manager', 'product_owner', 'owner', 'admin'],
            report_blocker: ['scrum_master', 'developer', 'contributor', 'owner', 'admin'],
            escalate_blocker: ['product_owner', 'scrum_master', 'owner', 'admin'],
            resolve_blocker: ['scrum_master', 'owner', 'admin'],
            post_standup: ['developer', 'contributor', 'owner', 'admin'],
            create_retro: ['scrum_master', 'owner', 'admin'],
            post_retro_card: ['developer', 'contributor', 'owner', 'admin'],
            create_action_item: ['product_owner', 'scrum_master', 'owner', 'admin']
        };

        const allowedRoles = matrix[action] || [];
        
        if (allowedRoles.includes(userRole)) {
            next();
        } else {
            return res.status(403).json({
                msg: `Role '${req.user?.role}' does not have permission for action: ${action}`
            });
        }
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
