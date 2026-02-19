import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Intern',
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const { name, email, password, role } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        const success = await register(name, email, password, role);
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl mb-4 font-bold text-center">Register</h2>
                <div className="mb-4">
                    <label className="block mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={onChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Role</label>
                    <select
                        name="role"
                        value={role}
                        onChange={onChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="Intern">Intern</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
