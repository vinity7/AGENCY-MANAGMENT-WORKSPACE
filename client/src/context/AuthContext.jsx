import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { isAtLeast, getDashboardType } from '../utils/roleHelpers';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(!user && !!token);

    useEffect(() => {
        const loadUser = async () => {
            if (token && !user) {
                try {
                    api.defaults.headers.common['x-auth-token'] = token;
                    // In a real app, fetch user from /api/users/me
                } catch (err) {
                    console.error('Load User Error:', err);
                    logout();
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await api.post('/users/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setToken(res.data.token);
            setUser(res.data.user);
            return { success: true };
        } catch (err) {
            console.error('Login Error:', err.response?.data || err.message);
            const serverMsg = err.response?.data?.msg || '';
            const rawErr = err.response?.data?.error || '';
            const serverErr = rawErr && typeof rawErr === 'object' ? JSON.stringify(rawErr) : rawErr;
            const errorMsg = serverMsg && serverErr ? `${serverMsg} (${serverErr})` : (serverMsg || serverErr || err.message);
            return { success: false, msg: errorMsg };
        }
    };

    const register = async (name, email, password, organizationName) => {
        try {
            console.log('Sending registration request for:', email);
            const res = await api.post('/users/register', { name, email, password, organizationName });
            console.log('Registration successful:', res.data);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setToken(res.data.token);
            setUser(res.data.user);
            return { success: true };
        } catch (err) {
            console.error('Register Error Details:', err.response?.data || err.message);
            const serverMsg = err.response?.data?.msg || '';
            const rawErr = err.response?.data?.error || '';
            const serverErr = rawErr && typeof rawErr === 'object' ? JSON.stringify(rawErr) : rawErr;
            const errorMsg = serverMsg && serverErr ? `${serverMsg} (${serverErr})` : (serverMsg || serverErr || err.message);
            return { success: false, msg: errorMsg };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    // Role-based helper methods
    const checkIsAtLeast = (requiredRole) => isAtLeast(user?.role, requiredRole);
    const dashboardType = getDashboardType(user?.role);

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            register, 
            login, 
            logout, 
            loading,
            isAtLeast: checkIsAtLeast,
            dashboardType
        }}>
            {children}
        </AuthContext.Provider>
    );
};
