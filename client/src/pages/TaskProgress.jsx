import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
    CheckCircle, 
    Circle, 
    ArrowLeft, 
    User, 
    ShieldCheck, 
    Calendar, 
    Briefcase,
    TrendingUp,
    Clock,
    Layout
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const TaskProgress = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTaskDetails();
    }, [id]);

    const fetchTaskDetails = async () => {
        try {
            const res = await api.get(`/tasks/${id}`);
            setTask(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleToggleMilestone = async (milestoneId) => {
        const userId = user?._id || user?.id;
        const isLead = task.teamLead?._id === userId;
        const isAdmin = user?.role === 'Admin';
        
        if (!isAdmin && !isLead) {
            alert('Restricted Access: Only the Team Lead and Administrators can check milestones.');
            return;
        }

        try {
            const res = await api.patch(`/tasks/${id}/milestones/${milestoneId}`);
            setTask(res.data);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Failed to update checkpoint');
        }
    };

    const isAuthorized = () => {
        const userId = user?._id || user?.id;
        return user?.role === 'Admin' || (task?.teamLead?._id === userId && !!userId);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (!task) return (
        <div className="p-10 text-center">
            <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Work Token Not Found</h2>
            <button onClick={() => navigate('/tasks')} className="mt-6 text-blue-400 flex items-center justify-center mx-auto transition-all hover:text-white bg-white/5 px-6 py-2 rounded-xl border border-white/5 active:scale-95">
                <ArrowLeft size={18} className="mr-2" /> Back to Allotment
            </button>
        </div>
    );

    const completedMilestones = task.milestones?.filter(m => m.completed).length || 0;
    const totalMilestones = task.milestones?.length || 0;
    const progressPercentage = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    return (
        <div className="p-4 md:p-10 space-y-8 max-w-6xl mx-auto min-h-screen">
            <button 
                onClick={() => navigate('/tasks')}
                className="flex items-center text-slate-400 hover:text-white transition-all group mb-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5 active:scale-95"
            >
                <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform text-blue-500" />
                <span className="font-black uppercase tracking-widest text-[10px]">Back to Allotment</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details & milestones */}
                <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <section className="glass-card p-8 rounded-3xl relative overflow-hidden border-t-4 border-t-blue-500/50 shadow-2xl">
                        <div className="absolute top-0 right-0 p-6">
                            <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                                task.priority === 'High' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/10' : 
                                task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/10' : 
                                'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10'
                            }`}>
                                {task.priority} Priority
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-blue-500/80 mb-3">
                             <Briefcase size={16} />
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] font-sans">{task.project?.name}</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-6 leading-[0.9]">{task.name}</h1>
                        <p className="text-slate-400 leading-relaxed text-[13px] font-medium border-l-[3px] border-blue-500/40 pl-6 py-2 italic bg-blue-500/5 rounded-r-2xl">
                            {task.description || "No detailed description provided for this work token."}
                        </p>

                        <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center">
                                    <Layout size={14} className="mr-2 text-blue-500" /> Project Brief
                                </h4>
                                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                                    {task.project?.description || "High-level strategic objectives defined within the parent project container."}
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center">
                                    <Clock size={14} className="mr-2 text-blue-500" /> Critical Timeline
                                </h4>
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Target</span>
                                        <span className="text-rose-500 font-black text-xl italic">
                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB') : 'Flexible'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col border-l border-white/10 pl-6">
                                        <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Stage</span>
                                        <span className="text-blue-400 font-black text-xl uppercase tracking-tighter">{task.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="glass-card p-8 rounded-3xl group shadow-2xl">
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">Execution Checkpoints</h2>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] italic">Strategic milestones to final delivery</p>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-black text-blue-500 tracking-tighter shadow-blue-500/20">{progressPercentage}%</div>
                                <div className="flex items-center justify-end gap-1.5 mt-1">
                                    <TrendingUp size={12} className="text-blue-500" />
                                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Pulse</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-4 bg-black/40 rounded-full mb-10 overflow-hidden border border-white/5 p-[3px]">
                            <div 
                                className="h-full premium-gradient rounded-full transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-end pr-2 overflow-hidden" 
                                style={{ width: `${progressPercentage}%` }}
                            >
                                <div className="h-0.5 w-full bg-white/20 rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {task.milestones?.length > 0 ? (
                                task.milestones.map((milestone) => (
                                    <div 
                                        key={milestone._id}
                                        onClick={() => handleToggleMilestone(milestone._id)}
                                        className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden active:scale-[0.99] ${
                                            milestone.completed 
                                            ? 'bg-emerald-500/5 border-emerald-500/20 shadow-emerald-500/5' 
                                            : !isAuthorized() 
                                                ? 'bg-white/[0.02] border-white/5 opacity-80' 
                                                : 'bg-white/5 border-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 cursor-pointer hover:shadow-xl shadow-blue-500/5'
                                        }`}
                                    >
                                        <div className="flex items-center gap-5 relative z-10">
                                            <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
                                                milestone.completed 
                                                ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30 rotate-[360deg]' 
                                                : !isAuthorized()
                                                    ? 'bg-slate-950 border-slate-900 shadow-inner overflow-hidden'
                                                    : 'border-slate-800 bg-slate-950 shadow-inner'
                                            }`}>
                                                {milestone.completed ? (
                                                    <CheckCircle size={20} className="text-white" />
                                                ) : !isAuthorized() ? (
                                                    <div className="w-full h-full flex items-center justify-center bg-black/40 text-slate-800 backdrop-blur-sm">
                                                        <Clock size={14} />
                                                    </div>
                                                ) : (
                                                    <Circle size={20} className="text-slate-800 group-hover:text-blue-500 transition-colors" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className={`text-lg font-black uppercase tracking-tight transition-all duration-500 ${
                                                    milestone.completed ? 'text-emerald-500/50 line-through' : 'text-slate-100'
                                                }`}>
                                                    {milestone.title}
                                                </h4>
                                                {milestone.deadline && (
                                                    <div className="flex items-center text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                                                        <Calendar size={10} className="mr-1.5 text-blue-500" />
                                                        Target Completion: {new Date(milestone.deadline).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 relative z-10">
                                            {!isAuthorized() && !milestone.completed && (
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest border border-white/5 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md flex items-center gap-2">
                                                    <Clock size={10} className="text-slate-600" /> Locked For Crew
                                                </span>
                                            )}
                                            {milestone.completed && (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-4 py-1.5 rounded-xl border border-emerald-500/20 shadow-emerald-500/5">
                                                        Verified by Lead
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-black/40 shadow-inner group-hover:border-blue-500/20 transition-colors duration-700">
                                    <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-700">
                                        <Layout size={32} className="text-slate-800 opacity-50" />
                                    </div>
                                    <h5 className="text-white/40 text-sm font-black uppercase tracking-widest mb-2 font-sans italic animate-pulse">Initializing Sequence...</h5>
                                    <p className="text-slate-700 text-xs font-black uppercase tracking-[0.3em] font-sans">No execution checkpoints defined for this work token.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Team Context */}
                <div className="space-y-8 animate-in fade-in slide-in-from-right-5 duration-700 delay-300">
                    <section className="glass-card p-8 rounded-3xl relative overflow-hidden group shadow-2xl border border-white/5">
                        <div className="absolute top-0 right-0 p-4 opacity-5 blur-sm group-hover:opacity-10 group-hover:blur-none transition-all duration-1000 ease-in-out">
                            <ShieldCheck size={120} className="text-blue-500" />
                        </div>
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center relative z-10">
                            <ShieldCheck size={14} className="mr-2 text-blue-500" /> Task Authority
                        </h3>
                        {task.teamLead ? (
                            <div className="p-6 bg-blue-600/[0.03] rounded-[2.5rem] border border-blue-500/10 hover:border-blue-500/30 transition-all duration-500 relative z-10 group/lead">
                                <div className="flex items-center">
                                    <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-black text-2xl mr-6 border-2 border-blue-500/20 shadow-2xl shadow-blue-500/20 group-hover/lead:scale-110 transition-transform duration-500">
                                        {task.teamLead.name?.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-black text-xl uppercase tracking-tighter leading-none mb-1.5 truncate shadow-blue-500/10">{task.teamLead.name}</h4>
                                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.15em] flex items-center">
                                            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-2.5 shadow-[0_0_10px_rgba(59,130,246,1)] animate-pulse"></span>
                                            Primary Team Lead
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 pt-5 border-t border-white/5">
                                    <p className="text-[11px] text-slate-500 font-bold lowercase italic truncate text-center opacity-60 group-hover/lead:opacity-100 transition-opacity font-sans">{task.teamLead.email}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center border-2 border-dashed border-white/5 rounded-[2.5rem] italic text-slate-800 text-[11px] font-black uppercase tracking-widest bg-black/10">
                                Lead not designated for this token
                            </div>
                        )}
                    </section>

                    <section className="glass-card p-8 rounded-3xl overflow-hidden relative shadow-2xl border border-white/5">
                         <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl"></div>
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center relative z-10">
                            <User size={14} className="mr-2 text-blue-500" /> Execute Crew
                        </h3>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-1 relative z-10">
                            {task.assignedMembers?.length > 0 ? (
                                task.assignedMembers.map((member) => (
                                    <div key={member._id} className="flex items-center p-4 bg-white/[0.03] rounded-2xl border border-white/5 group/member hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-slate-400 font-black text-md mr-5 border border-white/5 group-hover/member:border-blue-500/40 transition-all duration-500 shadow-inner group-hover/member:shadow-blue-500/10">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-slate-100 text-[13px] font-black uppercase tracking-tight truncate group-hover/member:text-white transition-colors">{member.name}</h4>
                                            <div className="flex items-center text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1.5 group-hover/member:text-slate-400 transition-colors">
                                                <span className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full mr-2.5 shadow-emerald-500/10"></span>
                                                Crew Member
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-700 text-[10px] font-black uppercase text-center italic py-24 bg-black/20 rounded-[3rem] border border-dashed border-white/5 shadow-inner">No additional crew assigned to this token.</p>
                            )}
                        </div>
                    </section>

                    <div className="bg-blue-600/[0.08] border border-blue-500/20 p-8 rounded-[3rem] relative overflow-hidden group shadow-2xl shadow-blue-600/5">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="flex items-center gap-5 mb-6 relative z-10">
                            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-2xl shadow-blue-600/50 group-hover:scale-110 transition-transform duration-700 ease-out border border-white/10">
                                <TrendingUp size={20} />
                            </div>
                            <h4 className="text-md font-black text-white uppercase tracking-tighter shadow-blue-600/10">System insight</h4>
                        </div>
                        <p className="text-slate-300 text-[13px] leading-relaxed font-semibold relative z-10 border-l-[3px] border-blue-500/40 pl-6 py-1 italic font-sans">
                            Milestone verification is strictly limited to the <span className="text-blue-500 font-black px-1">Team Lead</span> and <span className="text-blue-500 font-black px-1">Administrators</span>. 
                            Crew members can view pulse progress but must report to the authority to finalize execution checkpoints.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskProgress;
