/**
 * Role levels for hierarchy checks
 */
export const ROLE_LEVELS = {
  client: 1,
  contributor: 2,
  developer: 3,
  scrum_master: 4,
  product_manager: 5,
  product_owner: 6,
  admin: 9,
  owner: 10
};

/**
 * Mapping of roles to dashboard types
 */
export const DASHBOARD_MAP = {
  owner: 'lead',
  admin: 'lead',
  product_owner: 'po',
  product_manager: 'pm',
  scrum_master: 'sm',
  developer: 'dev',
  contributor: 'dev',
  client: 'client'
};

/**
 * Checks if a user has at least a certain role level
 */
export const isAtLeast = (userRole, requiredRole) => {
  const userRoleLower = userRole?.toLowerCase();
  const requiredRoleLower = requiredRole?.toLowerCase();
  
  return (ROLE_LEVELS[userRoleLower] || 0) >= (ROLE_LEVELS[requiredRoleLower] || 0);
};

/**
 * Gets the dashboard type for a given role
 */
export const getDashboardType = (role) => {
  return DASHBOARD_MAP[role?.toLowerCase()] || 'dev';
};
