import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RoleProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const userRole = user?.role?.toLowerCase();
    const isAllowed = allowedRoles.includes('all') || allowedRoles.includes(userRole);

    return isAllowed ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default RoleProtectedRoute;
