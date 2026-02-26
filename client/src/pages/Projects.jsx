import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { Plus, Calendar, User, AlignLeft, ArrowRight, Search, Filter, MoreVertical } from 'lucide-react';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext';

const Projects = () => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        client: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'Not Started'
    });

    useEffect(() => {
        fetchProjects();
        fetchClients();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const res = await api.get('/clients');
            setClients(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/projects', formData);
            fetchProjects();
            setIsModalOpen(false);
            setFormData({
                name: '',
                client: '',
                description: '',
                startDate: '',
                endDate: '',
                status: 'Not Started'
            });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Failed to add project');
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-100 text-emerald-700';
            case 'In Progress': return 'bg-sky-100 text-sky-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="p-4 md:p-10 space-y-10 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Project Portfolio</h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Manage and monitor the progress of all active agency work.</p>
                </div>
                {user?.role === 'Admin' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 px-5 py-2.5 text-sm font-bold text-white premium-gradient rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                    >
                        <Plus size={18} />
                        <span>Launch New Project</span>
                    </button>
                )}
            </header>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search projects or clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                    />
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                    <div key={project._id} className="glass-card p-7 rounded-2xl flex flex-col justify-between group hover:border-blue-200 transition-all duration-300">
                        <div>
                            <div className="flex justify-between items-start mb-5">
                                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <AlignLeft size={20} />
                                </div>
                                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${getStatusStyles(project.status)}`}>
                                    {project.status}
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight group-hover:text-blue-700 transition-colors">{project.name}</h3>
                            <div className="flex items-center text-sm font-bold text-slate-400 mb-4 bg-slate-50/50 w-fit px-3 py-1 rounded-lg">
                                <User size={14} className="mr-2" />
                                {project.client?.name}
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-3 italic">
                                "{project.description}"
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                <div className="flex flex-col">
                                    <span>Start Date</span>
                                    <span className="text-slate-800 mt-1">{new Date(project.startDate).toLocaleDateString('en-GB')}</span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span>Deadline</span>
                                    <span className="text-rose-600 mt-1">{new Date(project.endDate).toLocaleDateString('en-GB')}</span>
                                </div>
                            </div>

                            <button className="w-full py-2.5 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                View Details <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="p-20 text-center glass-card rounded-2xl">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <AlignLeft size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">No Projects Found</h3>
                    <p className="text-slate-400 mt-2 font-medium italic">Adjust your search or create a new project to get started.</p>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Launch New Project"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Project Identifier</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans" placeholder="e.g. Website Redesign" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Assign Client</label>
                        <select name="client" value={formData.client} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans bg-white appearance-none">
                            <option value="">Select an active client</option>
                            {clients.map(client => (
                                <option key={client._id} value={client._id}>{client.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Project Scope</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans min-h-[100px]" placeholder="Briefly describe the project goals..."></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Start Date</label>
                            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">End Date</label>
                            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Project Milestone</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans bg-white appearance-none">
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full py-3 mt-4 text-sm font-bold text-white premium-gradient rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all font-sans flex items-center justify-center gap-2">
                        Launch Project <ArrowRight size={18} />
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Projects;
