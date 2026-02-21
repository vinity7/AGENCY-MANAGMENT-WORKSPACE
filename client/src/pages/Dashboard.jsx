import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Users, Briefcase, CheckCircle, Clock, FileText, Activity } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-b-4" style={{ borderColor: color }}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 font-medium uppercase">{title}</p>
                <h3 className="text-2xl font-bold mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-full opacity-80`} style={{ backgroundColor: color + '22', color }}>
                <Icon size={24} />
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
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

    if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">Welcome back!</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Clients" value={stats?.counts.clients} icon={Users} color="#3b82f6" />
                <StatCard title="Projects" value={stats?.counts.projects} icon={Briefcase} color="#10b981" />
                <StatCard title="Pending Tasks" value={stats?.counts.pendingTasks} icon={Clock} color="#f59e0b" />
                {user?.role === 'Admin' && <StatCard title="Invoices" value={stats?.counts.invoices} icon={FileText} color="#8b5cf6" />}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Projects */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center space-x-2 mb-4">
                        <Activity className="text-blue-500" size={20} />
                        <h2 className="text-xl font-semibold">Active Projects</h2>
                    </div>
                    <div className="space-y-4">
                        {stats?.activeProjects.map(project => (
                            <div key={project._id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded transition">
                                <div>
                                    <p className="font-medium">{project.name}</p>
                                    <p className="text-xs text-gray-500">{project.status}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${project.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {project.status}
                                </span>
                            </div>
                        ))}
                        {stats?.activeProjects.length === 0 && <p className="text-center text-gray-400 py-4">No active projects.</p>}
                    </div>
                </div>

                {/* Recent Tasks */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center space-x-2 mb-4">
                        <CheckCircle className="text-green-500" size={20} />
                        <h2 className="text-xl font-semibold">Recent Tasks</h2>
                    </div>
                    <div className="space-y-4">
                        {stats?.recentTasks.map(task => (
                            <div key={task._id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded transition">
                                <div>
                                    <p className="font-medium">{task.name}</p>
                                    <p className="text-xs text-gray-500">{task.project?.name || 'No Project'}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${task.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {task.status}
                                </span>
                            </div>
                        ))}
                        {stats?.recentTasks.length === 0 && <p className="text-center text-gray-400 py-4">No recent tasks.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
