import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Briefcase, FileText, CheckSquare, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useContext(AuthContext);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
        { name: 'Clients', path: '/clients', icon: <Users size={20} /> },
        { name: 'Projects', path: '/projects', icon: <Briefcase size={20} /> },
        { name: 'Invoices', path: '/invoices', icon: <FileText size={20} /> },
        { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
    ];

    return (
        <div className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-blue-400">AgencyMgr</h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
