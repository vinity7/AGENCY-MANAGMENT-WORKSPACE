import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Briefcase, FileText, CheckSquare, LogOut, LayoutGrid } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const { logout, user } = useContext(AuthContext);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <Home size={18} /> },
        { name: 'Clients', path: '/clients', icon: <Users size={18} /> },
        { name: 'Projects', path: '/projects', icon: <Briefcase size={18} /> },
        { name: 'Invoices', path: '/invoices', icon: <FileText size={18} /> },
        { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={18} /> },
    ];

    if (user?.role === 'Admin') {
        navItems.push({ name: 'Analytics', path: '/analytics', icon: <LayoutGrid size={18} /> });
    }

    return (
        <div className="h-screen w-72 bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-50 shadow-2xl overflow-hidden">
            <div className="p-8 flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/40">
                    <LayoutGrid size={24} className="text-white" />
                </div>
                <h1 className="text-xl font-black tracking-tighter text-white">
                    AGENCY<span className="text-blue-500">MGR</span>
                </h1>
            </div>

            <nav className="flex-1 px-6 mt-4 space-y-1.5">
                <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Main Menu</p>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive(item.path)
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                            }`}
                    >
                        <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive(item.path) ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}>
                            {item.icon}
                        </span>
                        <span className="font-semibold text-sm">{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-6 border-t border-slate-800/50">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3.5 w-full text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-300 group"
                >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-sm">Logout Session</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
