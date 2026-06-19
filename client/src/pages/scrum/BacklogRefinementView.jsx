import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUp, ArrowRight, Zap, Target, Loader2, Plus, X, AlignLeft } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const BacklogRefinementView = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newStory, setNewStory] = useState({
        name: '',
        description: '',
        project: '',
        refinementState: 'Discovery',
        priority: 'Medium'
    });

    const columns = [
        { id: 'Discovery', title: 'Discovery', subtitle: 'Analyzing requirements', color: 'slate' },
        { id: 'Validated', title: 'Validated', subtitle: 'Refining backlog definition', color: 'blue' },
        { id: 'Ready for Development', title: 'Ready for Development', subtitle: 'Approved for sprint planning', color: 'emerald' }
    ];

    const fetchTasksAndProjects = async () => {
        try {
            const [tasksRes, projectsRes] = await Promise.all([
                api.get('/tasks'),
                api.get('/projects')
            ]);
            setTasks(tasksRes.data);
            setProjects(projectsRes.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching refinement data:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasksAndProjects();
    }, []);

    const handleCreateStory = async (e) => {
        e.preventDefault();
        try {
            // Note: Creating task using standard backend POST /tasks
            await api.post('/tasks', {
                ...newStory,
                reach: 0,
                impact: 1,
                confidence: 100,
                effort: 1
            });
            setShowCreateModal(false);
            setNewStory({
                name: '',
                description: '',
                project: '',
                refinementState: 'Discovery',
                priority: 'Medium'
            });
            fetchTasksAndProjects();
        } catch (err) {
            console.error('Create story error:', err);
            alert(err.response?.data?.msg || 'Failed to create backlog item');
        }
    };

    const handleMoveState = async (taskId, newState) => {
        try {
            // Persist the refinementState change via PATCH /api/v1/tasks/:taskId
            await api.patch(`/v1/tasks/${taskId}`, { refinementState: newState });
            
            // Optimistic update
            setTasks(prevTasks => 
                prevTasks.map(t => t._id === taskId ? { ...t, refinementState: newState } : t)
            );
        } catch (err) {
            console.error('Update refinementState error:', err);
            alert(err.response?.data?.msg || 'Failed to move backlog item');
        }
    };

    const getFilteredTasks = (colId) => {
        return tasks.filter(t => {
            const matchesCol = (t.refinementState || 'Discovery') === colId;
            const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 (t.description || '').toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCol && matchesSearch;
        });
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 size={32} className="text-blue-500 animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Header controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#111111] p-6 rounded-3xl border border-white/5 shadow-xl">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search backlog items by title or scope..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600"
                    />
                </div>
                <div className="flex space-x-3 w-full md:w-auto">
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="flex-1 md:flex-none premium-gradient px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2"
                    >
                        <Plus size={14} />
                        <span>New Story</span>
                    </button>
                </div>
            </div>

            {/* Board Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {columns.map(col => {
                    const colTasks = getFilteredTasks(col.id);
                    return (
                        <div key={col.id} className="flex flex-col space-y-6">
                            <div className="px-2">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest flex justify-between items-center">
                                    <span>{col.title}</span>
                                    <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{colTasks.length}</span>
                                </h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{col.subtitle}</p>
                            </div>

                            <div 
                                className="min-h-[500px] bg-white/[0.01] border-2 border-dashed border-white/5 rounded-3xl p-4 space-y-4"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const taskId = e.dataTransfer.getData('text/plain');
                                    if (taskId) handleMoveState(taskId, col.id);
                                }}
                            >
                                {colTasks.map(task => (
                                    <div 
                                        key={task._id} 
                                        draggable
                                        onDragStart={(e) => e.dataTransfer.setData('text/plain', task._id)}
                                        className="p-5 bg-[#111111] border border-white/5 rounded-2xl group hover:border-blue-500/30 transition-all shadow-xl relative cursor-grab active:cursor-grabbing"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                                                task.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 
                                                task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 
                                                'bg-emerald-500/10 text-emerald-500'
                                            }`}>
                                                {task.priority || 'Medium'}
                                            </span>
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                                                {task.project?.name || 'Linked Project'}
                                            </span>
                                        </div>

                                        <h4 className="text-sm font-bold text-white mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{task.name}</h4>
                                        <p className="text-xs text-slate-500 line-clamp-2 italic mb-4">"{task.description || 'No description provided.'}"</p>

                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <div className="flex items-center space-x-1.5 text-blue-500">
                                                <ArrowUp size={12} />
                                                <span className="text-[10px] font-black italic">RICE: {task.riceScore ? task.riceScore.toFixed(1) : '0.0'}</span>
                                            </div>
                                            
                                            {/* Column advancement arrows */}
                                            <div className="flex space-x-1">
                                                {col.id === 'Discovery' && (
                                                    <button 
                                                        onClick={() => handleMoveState(task._id, 'Validated')}
                                                        className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors"
                                                        title="Move to Validated"
                                                    >
                                                        <ArrowRight size={14} />
                                                    </button>
                                                )}
                                                {col.id === 'Validated' && (
                                                    <button 
                                                        onClick={() => handleMoveState(task._id, 'Ready for Development')}
                                                        className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-emerald-400 transition-colors"
                                                        title="Move to Ready for Development"
                                                    >
                                                        <ArrowRight size={14} className="text-emerald-500" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {colTasks.length === 0 && (
                                    <div className="py-20 text-center text-slate-700 text-[10px] font-black uppercase tracking-widest">
                                        No items in {col.title}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Create Backlog Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create Backlog Story"
            >
                <form onSubmit={handleCreateStory} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Story Title</label>
                        <input 
                            type="text" 
                            required 
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                            placeholder="e.g. Implement roadmap timeline views"
                            value={newStory.name}
                            onChange={e => setNewStory({...newStory, name: e.target.value})}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Strategic Description / Scope</label>
                        <textarea 
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                            placeholder="Define the scope and requirements..."
                            rows="3"
                            value={newStory.description}
                            onChange={e => setNewStory({...newStory, description: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Origin Project</label>
                            <select 
                                required
                                className="w-full px-4 py-2.5 border border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans bg-[#1a1a1a] text-white"
                                value={newStory.project}
                                onChange={e => setNewStory({...newStory, project: e.target.value})}
                            >
                                <option value="" className="bg-[#1a1a1a]">Select Project</option>
                                {projects.map(p => (
                                    <option key={p._id} value={p._id} className="bg-[#1a1a1a]">{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Priority</label>
                            <select 
                                className="w-full px-4 py-2.5 border border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans bg-[#1a1a1a] text-white"
                                value={newStory.priority}
                                onChange={e => setNewStory({...newStory, priority: e.target.value})}
                            >
                                <option value="Low" className="bg-[#1a1a1a]">Low</option>
                                <option value="Medium" className="bg-[#1a1a1a]">Medium</option>
                                <option value="High" className="bg-[#1a1a1a]">High</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full py-4 mt-6 text-sm font-black text-white premium-gradient rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all font-sans flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        Initialize Backlog Story <AlignLeft size={16} />
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default BacklogRefinementView;
