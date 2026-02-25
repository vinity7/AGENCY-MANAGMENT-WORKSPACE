import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-auth-card">
                {/* Left Side: Form */}
                <div className="login-form-side">
                    <div className="top-dots">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>

                    <h1 className="sign-in-title">Sign in</h1>

                    <form onSubmit={onSubmit}>
                        <div className="input-container">
                            <label className="field-label">Your email</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                placeholder="Charles@comet.co"
                                className="custom-input"
                                required
                            />
                        </div>

                        <div className="input-container">
                            <div className="password-header">
                                <label className="field-label">Password</label>
                                <Link to="/forgot-password" name="forgot-password" id="forgot-password" className="forgot-link">Forgot password?</Link>
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                placeholder="••••••••••••"
                                className="custom-input"
                                required
                            />
                        </div>

                        <button type="submit" className="submit-btn">
                            Sign in
                        </button>
                    </form>

                    <p className="bottom-signup">
                        Don't have an account? <Link to="/register">Sign up</Link>
                    </p>
                </div>

                {/* Right Side: Decoration */}
                <div className="login-decoration-side">
                    <div className="space-particles"></div>
                    <div className="shooting-star star-1"></div>
                    <div className="shooting-star star-2"></div>

                    <div className="planet-element">
                        {/* If an image is available later, it can go here */}
                    </div>

                    <div className="cosset-brand">AMW</div>
                </div>
            </div>
        </div>
    );
};

export default Login;
