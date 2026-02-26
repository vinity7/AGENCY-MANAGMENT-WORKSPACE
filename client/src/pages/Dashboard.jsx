import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Users, Briefcase, CheckCircle, Clock, FileText, Activity, ArrowRight, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div
        className="glass-card p-6 rounded-2xl hover:translate-y-[-4px] transition-all duration-300 relative overflow-hidden group border-b-0"
    >
        <div
            className="absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
            style={{ backgroundColor: color }}
        />
        <div className="flex items-center justify-between relative z-10">
            <div>
                <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase mb-1">{title}</p>
                <div className="flex items-baseline space-x-2">
                    <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
                    <TrendingUp size={14} className="text-emerald-500" />
                </div>
            </div>
            <div
                className="p-3.5 rounded-xl transition-colors duration-300"
                style={{ backgroundColor: color + '15', color }}
            >
                <Icon size={24} className="opacity-90" />
            </div>
        </div>
        <div className="mt-4 flex items-center text-[10px] font-medium text-slate-400">
            <span className="text-emerald-500">+12%</span>
            <span className="ml-1">since last month</span>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                setStats(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="p-4 md:p-10 space-y-10 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">
                        Welcome back, <span className="text-blue-600 font-bold">{user?.name}</span>. Here's what's happening today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 bg-opacity-80 rounded-lg hover:bg-blue-100 transition-colors">
                        Download Report
                    </button>
                    <button className="px-4 py-2 text-xs font-bold text-white premium-gradient rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all">
                        Create New
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Clients" value={stats?.counts.clients} icon={Users} color="#3b82f6" />
                <StatCard title="Active Projects" value={stats?.counts.projects} icon={Briefcase} color="#7c3aed" />
                <StatCard title="Pending Tasks" value={stats?.counts.pendingTasks} icon={Clock} color="#f59e0b" />
                {user?.role === 'Admin' && <StatCard title="Invoices" value={stats?.counts.invoices} icon={FileText} color="#059669" />}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Projects */}
                <div className="glass-card p-8 rounded-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100/50 rounded-lg text-blue-600">
                                <Activity size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Active Projects</h2>
                        </div>
                        <button className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
                            View All <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="space-y-5">
                        {stats?.activeProjects.map(project => (
                            <div key={project._id} className="group flex justify-between items-center p-4 rounded-xl hover:bg-white/50 border border-transparent hover:border-slate-100 transition-all duration-300">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full premium-gradient flex items-center justify-center text-white font-bold text-sm">
                                        {project.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{project.name}</p>
                                        <p className="text-xs text-slate-400 font-medium">Last updated 2 days ago</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {project.status}
                                </span>
                            </div>
                        ))}
                        {stats?.activeProjects.length === 0 && (
                            <div className="text-center py-10 opacity-60">
                                <p className="text-slate-400 font-medium italic">No active projects yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Tasks */}
                <div className="glass-card p-8 rounded-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-emerald-100/50 rounded-lg text-emerald-600">
                                <CheckCircle size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Recent Tasks</h2>
                        </div>
                        <button className="text-sm font-bold text-emerald-600 flex items-center gap-1 hover:gap-2 transition-all">
                            View All <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {stats?.recentTasks.map(task => (
                            <div key={task._id} className="group flex justify-between items-center p-4 rounded-xl hover:bg-white/50 border border-transparent hover:border-slate-100 transition-all duration-300">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2 rounded-lg ${task.status === 'Completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                                        <CheckCircle size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{task.name}</p>
                                        <p className="text-xs text-slate-400 font-medium truncate max-w-[150px]">{task.project?.name || 'No Project'}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {task.status}
                                </span>
                            </div>
                        ))}
                        {stats?.recentTasks.length === 0 && (
                            <div className="text-center py-10 opacity-60">
                                <p className="text-slate-400 font-medium italic">No tasks assigned recently.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
