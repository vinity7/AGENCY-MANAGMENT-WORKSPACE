import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            api.defaults.headers.common['x-auth-token'] = token;
            // Ideally check if token is valid via an endpoint like /api/users/me
            setLoading(false);
        } else {
            delete api.defaults.headers.common['x-auth-token'];
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await api.post('/users/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
            return true;
        } catch (err) {
            console.error(err.response?.data || err.message);
            return false;
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const res = await api.post('/users/register', { name, email, password, role });
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
            return true;
        } catch (err) {
            console.error(err.response?.data || err.message);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, register, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
