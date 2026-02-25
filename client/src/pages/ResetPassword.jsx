import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import './Auth.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const email = searchParams.get('email'); // In a real app, this would be a token

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            const res = await axios.post('/users/reset-password', { email, newPassword });
            setMessage(res.data.msg);
            setError('');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Something went wrong');
            setMessage('');
        }
    };

    if (!email) {
        return (
            <div className="login-page-wrapper">
                <div className="login-auth-card">
                    <div className="login-form-side">
                        <h1 className="sign-in-title">Invalid link</h1>
                        <p className="field-label">Please request a new password reset link.</p>
                        <Link to="/forgot-password" style={{ color: '#ffffff', fontWeight: '600' }}>Forgot password?</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page-wrapper">
            <div className="login-auth-card">
                <div className="login-form-side">
                    <div className="top-dots">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>

                    <h1 className="sign-in-title">Set new password</h1>
                    <p className="field-label" style={{ marginBottom: '2rem' }}>
                        Create a new password for your account <strong>{email}</strong>.
                    </p>

                    {message && <p className="text-green-500 mb-4">{message}</p>}
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <form onSubmit={onSubmit}>
                        <div className="input-container">
                            <label className="field-label">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="custom-input"
                                required
                            />
                        </div>

                        <div className="input-container">
                            <label className="field-label">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="custom-input"
                                required
                            />
                        </div>

                        <button type="submit" className="submit-btn" style={{ marginTop: '0.5rem' }}>
                            Update password
                        </button>
                    </form>
                </div>

                <div className="login-decoration-side">
                    <div className="space-particles"></div>
                    <div className="shooting-star star-1"></div>
                    <div className="shooting-star star-2"></div>
                    <div className="planet-element"></div>
                    <div className="cosset-brand">cosset</div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
