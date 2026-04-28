import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
    Plus, 
    CheckCircle, 
    Clock, 
    AlertCircle, 
    User, 
    Briefcase, 
    Calendar, 
    ChevronRight, 
    Play, 
    Pause, 
    Check, 
    MoreHorizontal, 
    Trash2,
    ShieldCheck,
    X,
    Users
} from 'lucide-react';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext';

const Tasks = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        project: '',
        assignedMembers: [],
        teamLead: '',
        dueDate: '',
        status: 'Pending',
        priority: 'Medium',
        milestones: [],
        reach: 0,
        impact: 0,
        confidence: 100,
        effort: 1
    });

    const [newMilestone, setNewMilestone] = useState({ title: '', deadline: '' });
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'rice', 'priority'

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

    const handleMemberToggle = (memberId) => {
        const currentMembers = [...formData.assignedMembers];
        const index = currentMembers.indexOf(memberId);
        if (index > -1) {
            currentMembers.splice(index, 1);
        } else {
            currentMembers.push(memberId);
        }
        setFormData({ ...formData, assignedMembers: currentMembers });
    };

    const addMilestone = () => {
        if (!newMilestone.title) return;
        setFormData({
            ...formData,
            milestones: [...formData.milestones, { ...newMilestone }]
        });
        setNewMilestone({ title: '', deadline: '' });
    };

    const removeMilestone = (index) => {
        const updated = [...formData.milestones];
        updated.splice(index, 1);
        setFormData({ ...formData, milestones: updated });
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
                assignedMembers: [],
                teamLead: '',
                dueDate: '',
                status: 'Pending',
                priority: 'Medium',
                milestones: [],
                reach: 0,
                impact: 0,
                confidence: 100,
                effort: 1
            });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Failed to add task');
        }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
            try {
                await api.delete(`/tasks/${id}`);
                setTasks(tasks.filter(task => task._id !== id));
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.msg || 'Failed to delete task');
            }
        }
    };

    const getSortedTasks = () => {
        let sorted = [...tasks];
        if (sortBy === 'rice') {
            return sorted.sort((a, b) => (b.riceScore || 0) - (a.riceScore || 0));
        } else if (sortBy === 'priority') {
            const weights = { 'High': 3, 'Medium': 2, 'Low': 1 };
            return sorted.sort((a, b) => (weights[b.priority] || 0) - (weights[a.priority] || 0));
        }
        return sorted; // default newest from API
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
        
        const isLead = task.teamLead?._id === user?.id;
        const isMember = task.assignedMembers?.some(m => m._id === user?.id);
        
        return isLead || isMember;
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
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Team Task Engine</h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium italic">Orchestrate collaborative workflows and track milestone progress.</p>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-black text-blue-400 uppercase tracking-widest outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="newest" className="bg-[#1a1a1a]">Sort: Newest</option>
                        <option value="rice" className="bg-[#1a1a1a]">Sort: RICE Score</option>
                        <option value="priority" className="bg-[#1a1a1a]">Sort: Priority</option>
                    </select>
                    {user?.role === 'Admin' && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center space-x-2 px-5 py-2.5 text-sm font-bold text-white premium-gradient rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all font-sans"
                        >
                            <Plus size={18} />
                            <span>Deploy Team Task</span>
                        </button>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getSortedTasks().map((task) => (
                    <div key={task._id} className="glass-card p-6 rounded-2xl flex flex-col justify-between group hover:shadow-2xl transition-all duration-300 border-l-[6px] border-l-blue-500/50">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getPriorityStyles(task.priority)}`}>
                                    <span>{task.priority || 'Medium'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex flex-col items-end">
                                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">RICE Score</div>
                                        <div className="text-sm font-black text-white leading-none">{(task.riceScore || 0).toFixed(1)}</div>
                                    </div>
                                    {user?.role === 'Admin' && (
                                        <button
                                            onClick={() => handleDeleteTask(task._id)}
                                            className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors bg-white/5 rounded-lg hover:bg-white/10 shadow-sm ml-2"
                                            title="Delete Task"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-lg font-black text-white mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{task.name}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-6 line-clamp-2 italic">{task.description}</p>

                            <div className="space-y-3 mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                                    <div className="flex items-center text-slate-500">
                                        <ShieldCheck size={12} className="mr-2 text-blue-500" />
                                        Team Lead
                                    </div>
                                    <span className="text-slate-200">{task.teamLead?.name || 'N/A'}</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                                    <div className="flex items-center text-slate-500">
                                        <Users size={12} className="mr-2 text-blue-500" />
                                        Execute Crew
                                    </div>
                                    <span className="text-slate-200">
                                        {task.assignedMembers?.length || 0} Members
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                                    <div className="flex items-center text-slate-400">
                                        <Calendar size={12} className="mr-2" />
                                        Deadline
                                    </div>
                                    <span className={task.status !== 'Completed' ? 'text-rose-600' : 'text-slate-400'}>
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB') : 'Flexible'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button 
                                onClick={() => navigate(`/tasks/${task._id}/progress`)}
                                className="w-full py-2.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                Check Progress <ChevronRight size={14} />
                            </button>

                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
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
                                                    className="p-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                                    title="Mark as Complete"
                                                >
                                                    <Check size={14} />
                                                </button>
                                            )}
                                            {task.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(task._id, 'In Progress')}
                                                    className="p-1.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                                    title="Start Task"
                                                >
                                                    <Play size={14} />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
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
                title="Deploy Team Work Token"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Task Identifier</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans placeholder:text-slate-600" placeholder="e.g. Platform UI Overhaul" />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Strategic Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans placeholder:text-slate-600" placeholder="Brief the team on requirements..."></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Origin Project</label>
                            <select name="project" value={formData.project} onChange={handleChange} required className="w-full px-4 py-2.5 border border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans bg-[#1a1a1a] appearance-none text-white">
                                <option value="" className="bg-[#1a1a1a]">Link Project</option>
                                {projects.map(project => (
                                    <option key={project._id} value={project._id} className="bg-[#1a1a1a]">{project.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Criticality</label>
                            <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-4 py-2.5 border border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans bg-[#1a1a1a] appearance-none text-white">
                                <option value="Low" className="bg-[#1a1a1a]">Low</option>
                                <option value="Medium" className="bg-[#1a1a1a]">Medium</option>
                                <option value="High" className="bg-[#1a1a1a]">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Team Lead</label>
                            <select name="teamLead" value={formData.teamLead} onChange={handleChange} required className="w-full px-4 py-2.5 border border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans bg-[#1a1a1a] appearance-none text-white">
                                <option value="" className="bg-[#1a1a1a]">Select Lead</option>
                                {interns.map(intern => (
                                    <option key={intern._id} value={intern._id} className="bg-[#1a1a1a]">{intern.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Overall Deadline</label>
                            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans" />
                        </div>
                    </div>


                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Execute Crew (Multi-Select)</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-black/20 rounded-2xl border border-white/5 custom-scrollbar overscroll-contain">

                            {interns.map((intern) => (
                                <label 
                                    key={intern._id} 
                                    className={`flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                        formData.assignedMembers.includes(intern._id)
                                        ? 'bg-blue-600/10 border-blue-500/40'
                                        : 'bg-white/5 border-white/5 hover:border-white/10'
                                    }`}
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                        formData.assignedMembers.includes(intern._id) ? 'bg-blue-600 border-blue-600' : 'border-slate-600'
                                    }`}>
                                        {formData.assignedMembers.includes(intern._id) && <Check size={12} className="text-white" />}
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="hidden"
                                        checked={formData.assignedMembers.includes(intern._id)}
                                        onChange={() => handleMemberToggle(intern._id)}
                                    />
                                    <span className={`text-[11px] font-black uppercase tracking-tight ${
                                        formData.assignedMembers.includes(intern._id) ? 'text-blue-400' : 'text-slate-300'
                                    }`}>
                                        {intern.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>


                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Progress Milestones</label>
                        <div className="space-y-2">
                            {formData.milestones.length > 0 ? (
                                formData.milestones.map((milestone, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-3 bg-blue-500/5 rounded-xl border border-blue-500/20">
                                        <div className="flex-1">
                                            <p className="text-[11px] font-black text-blue-400 uppercase tracking-tight">{milestone.title}</p>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{milestone.deadline || 'No completion target'}</p>
                                        </div>
                                        <button type="button" onClick={() => removeMilestone(idx)} className="p-1.5 text-slate-500 hover:text-rose-500 transition-colors">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[10px] text-slate-600 italic font-medium pl-1">No execution milestones added yet.</p>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 mt-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                            <input 
                                type="text" 
                                placeholder="Milestone Identifier" 
                                value={newMilestone.title}
                                onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                                className="flex-1 px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-blue-500" 
                            />
                            <input 
                                type="date" 
                                value={newMilestone.deadline}
                                onChange={(e) => setNewMilestone({...newMilestone, deadline: e.target.value})}
                                className="w-full sm:w-32 px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-blue-500" 
                            />
                            <button 
                                type="button" 
                                onClick={addMilestone}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Reach</label>
                            <input type="number" name="reach" value={formData.reach} onChange={handleChange} className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-blue-500" placeholder="0" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Impact</label>
                            <input type="number" step="0.5" name="impact" value={formData.impact} onChange={handleChange} className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-blue-500" placeholder="0" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Conf %</label>
                            <input type="number" name="confidence" value={formData.confidence} onChange={handleChange} className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-blue-500" placeholder="100" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Effort</label>
                            <input type="number" name="effort" value={formData.effort} onChange={handleChange} className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-blue-500" placeholder="1" />
                        </div>
                        <div className="col-span-4 text-center">
                            <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                                Projected RICE: {((formData.reach * formData.impact * (formData.confidence / 100)) / (formData.effort || 1)).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-4 mt-6 text-sm font-black text-white premium-gradient rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all font-sans flex items-center justify-center gap-3 active:scale-[0.98]">
                        Deploy Work Order <Users size={18} />
                    </button>

                </form>
            </Modal>
        </div>
    );
};

export default Tasks;

