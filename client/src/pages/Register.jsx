import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        organizationName: '',
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const { name, email, password, organizationName } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        const result = await register(name, email, password, organizationName);
        if (result.success) {
            navigate('/dashboard');
        } else {
            alert(`Registration failed: ${result.msg || 'Please try again.'}`);
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

                    <h1 className="sign-in-title">Create account</h1>

                    <form onSubmit={onSubmit}>
                        <div className="input-container">
                            <label className="field-label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={onChange}
                                placeholder="Your Name"
                                className="custom-input"
                                required
                            />
                        </div>

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
                            <label className="field-label">Password</label>
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

                        <div className="input-container">
                            <label className="field-label">Organization Name</label>
                            <input
                                type="text"
                                name="organizationName"
                                value={organizationName}
                                onChange={onChange}
                                placeholder="Your Agency Name"
                                className="custom-input"
                                required
                            />
                        </div>

                        <button type="submit" className="submit-btn">
                            Sign up
                        </button>
                    </form>

                    <p className="bottom-signup">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </div>

                {/* Right Side: Decoration */}
                <div className="login-decoration-side">
                    <div className="space-particles"></div>
                    <div className="shooting-star star-1"></div>
                    <div className="shooting-star star-2"></div>

                    <div className="planet-element"></div>

                    <div className="cosset-brand">AgencyOS</div>
                </div>
            </div>
        </div>
    );
};

export default Register;

