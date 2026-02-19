import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { logout } = useContext(AuthContext);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p>Welcome to the Agency Management Workspace.</p>
            <button
                onClick={logout}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
