import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { Plus, CheckCircle, Clock, AlertCircle, User, Briefcase, Calendar, ChevronRight, Play, Pause, Check, MoreHorizontal } from 'lucide-react';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext';

const Tasks = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        project: '',
        assignedTo: '',
        dueDate: '',
        status: 'Pending',
        priority: 'Medium'
    });

    useEffect(() => {
        fetchTasks();
        fetchProjects();
        fetchInterns();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchInterns = async () => {
        try {
            const res = await api.get('/users/interns');
            setInterns(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
            fetchTasks();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Failed to update status');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', formData);
            fetchTasks();
            setIsModalOpen(false);
            setFormData({
                name: '',
                description: '',
                project: '',
                assignedTo: '',
                dueDate: '',
                status: 'Pending',
                priority: 'Medium'
            });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Failed to add task');
        }
    };

    const getPriorityStyles = (priority) => {
        switch (priority) {
            case 'High': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Low': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle size={16} className="text-emerald-500" />;
            case 'In Progress': return <Clock size={16} className="text-blue-500" />;
            case 'On Hold': return <Pause size={16} className="text-amber-500" />;
            default: return <AlertCircle size={16} className="text-slate-400" />;
        }
    };

    const canUpdateStatus = (task) => {
        if (user?.role === 'Admin') return true;
        return task.assignedTo?._id === user?.id;
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="p-4 md:p-10 space-y-10 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Task Allotment</h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Distribute and track individual tokens of work across the team.</p>
                </div>
                {user?.role === 'Admin' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 px-5 py-2.5 text-sm font-bold text-white premium-gradient rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all font-sans"
                    >
                        <Plus size={18} />
                        <span>Create Task Token</span>
                    </button>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                    <div key={task._id} className="glass-card p-6 rounded-2xl flex flex-col justify-between group hover:shadow-xl transition-all duration-300 border-l-[6px] border-l-blue-500">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getPriorityStyles(task.priority)}`}>
                                    <span>{task.priority || 'Medium'}</span>
                                </div>
                                <div className="text-slate-300">
                                    <MoreHorizontal size={18} />
                                </div>
                            </div>

                            <h3 className="text-lg font-black text-slate-800 mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{task.name}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-6 line-clamp-2">{task.description}</p>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <div className="flex items-center text-slate-400">
                                        <Briefcase size={14} className="mr-2" />
                                        Project
                                    </div>
                                    <span className="text-slate-700">{task.project?.name}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <div className="flex items-center text-slate-400">
                                        <User size={14} className="mr-2" />
                                        Assignee
                                    </div>
                                    <span className="text-slate-700">{task.assignedTo?.name || 'Unassigned'}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <div className="flex items-center text-slate-400">
                                        <Calendar size={14} className="mr-2" />
                                        Deadline
                                    </div>
                                    <span className={task.status !== 'Completed' ? 'text-rose-600' : 'text-slate-400 font-medium'}>
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB') : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {getStatusIcon(task.status)}
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{task.status}</span>
                            </div>

                            <div className="flex space-x-2">
                                {canUpdateStatus(task) && (
                                    <>
                                        {task.status !== 'Completed' && (
                                            <button
                                                onClick={() => handleStatusUpdate(task._id, 'Completed')}
                                                className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                title="Mark as Complete"
                                            >
                                                <Check size={14} />
                                            </button>
                                        )}
                                        {task.status === 'Pending' && (
                                            <button
                                                onClick={() => handleStatusUpdate(task._id, 'In Progress')}
                                                className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                title="Start Task"
                                            >
                                                <Play size={14} />
                                            </button>
                                        )}
                                        {task.status === 'In Progress' && (
                                            <button
                                                onClick={() => handleStatusUpdate(task._id, 'On Hold')}
                                                className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-600 hover:text-white transition-all shadow-sm"
                                                title="Put on Hold"
                                            >
                                                <Pause size={14} />
                                            </button>
                                        )}
                                    </>
                                )}
                                <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {tasks.length === 0 && (
                <div className="p-20 text-center glass-card rounded-2xl">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <CheckCircle size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">No Tasks Assigned</h3>
                    <p className="text-slate-400 mt-2 font-medium italic">Everything is clear. Create a new task token to begin work.</p>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create Task Token"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Task Identifier</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans" placeholder="e.g. Implement Auth Flow" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Work Requirements</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans" placeholder="Details of the work to be performed..."></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Origin Project</label>
                            <select name="project" value={formData.project} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans bg-white appearance-none">
                                <option value="">Select Project</option>
                                {projects.map(project => (
                                    <option key={project._id} value={project._id}>{project.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Criticality</label>
                            <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans bg-white appearance-none">
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Lead Executor (Intern)</label>
                        <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans bg-white appearance-none">
                            <option value="">Select Intern (Optional)</option>
                            {interns.map(intern => (
                                <option key={intern._id} value={intern._id}>{intern.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Target Deadline</label>
                            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Lifecycle Stage</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans bg-white appearance-none">
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="On Hold">On Hold</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="w-full py-3 mt-4 text-sm font-bold text-white premium-gradient rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all font-sans flex items-center justify-center gap-2">
                        Issue Task Token <Plus size={18} />
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Tasks;
