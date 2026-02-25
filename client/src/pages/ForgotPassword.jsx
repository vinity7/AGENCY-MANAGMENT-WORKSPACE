import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/users/forgot-password', { email });
            setMessage(res.data.msg);
            setError('');
        } catch (err) {
            setError(err.response?.data?.msg || 'Something went wrong');
            setMessage('');
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-auth-card">
                <div className="login-form-side">
                    <div className="top-dots">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>

                    <h1 className="sign-in-title">Reset password</h1>
                    <p className="field-label" style={{ marginBottom: '2rem' }}>
                        Enter your email address and we'll send you instructions to reset your password.
                    </p>

                    {message && <p className="text-green-500 mb-4">{message}</p>}
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <form onSubmit={onSubmit}>
                        <div className="input-container">
                            <label className="field-label">Your email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Charles@comet.co"
                                className="custom-input"
                                required
                            />
                        </div>

                        <button type="submit" className="submit-btn" style={{ marginTop: '0.5rem' }}>
                            Send instructions
                        </button>
                    </form>

                    <p className="bottom-signup">
                        Remembered your password? <Link to="/login">Sign in</Link>
                    </p>
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

export default ForgotPassword;
