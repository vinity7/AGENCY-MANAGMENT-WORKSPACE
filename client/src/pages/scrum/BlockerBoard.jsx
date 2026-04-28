import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, ShieldAlert, ArrowUpCircle, Plus, Loader2, X } from 'lucide-react';
import api from '../../api/axios';

const BlockerBoard = () => {
    const [blockers, setBlockers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReportModal, setShowReportModal] = useState(false);
    const [newBlocker, setNewBlocker] = useState({ title: '', description: '', severity: 'P1' });

    const columns = [
        { id: 'reported', title: 'Reported', color: 'slate' },
        { id: 'investigating', title: 'Investigating', color: 'blue' },
        { id: 'resolving', title: 'Resolving', color: 'emerald' },
        { id: 'resolved', title: 'Resolved', color: 'slate-muted' }
    ];

    const fetchBlockers = async () => {
        try {
            const res = await api.get('/v1/blockers');
            setBlockers(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching blockers:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlockers();
    }, []);

    const handleEscalate = async (id) => {
        try {
            await api.post(`/v1/blockers/${id}/escalate`);
            fetchBlockers();
        } catch (err) {
            console.error('Escalation error:', err);
        }
    };

    const handleReport = async (e) => {
        e.preventDefault();
        try {
            await api.post('/v1/blockers', newBlocker);
            setShowReportModal(false);
            setNewBlocker({ title: '', description: '', severity: 'P1' });
            fetchBlockers();
        } catch (err) {
            console.error('Report error:', err);
        }
    };

    const calculateAge = (createdAt) => {
        const hours = Math.floor((new Date() - new Date(createdAt)) / 36e5);
        if (hours < 1) return '< 1h';
        return `${hours}h`;
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 size={32} className="text-rose-500 animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button 
                    onClick={() => setShowReportModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-rose-500/20"
                >
                    <Plus size={16} />
                    <span>Report Blocker</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {columns.map(col => (
                    <div key={col.id} className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{col.title}</h3>
                            <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                                {blockers.filter(b => b.status === col.id).length}
                            </span>
                        </div>
                        
                        <div className={`min-h-[600px] rounded-3xl bg-white/[0.01] border border-dashed border-white/5 p-4 space-y-4`}>
                            {blockers.filter(b => b.status === col.id).map(blocker => (
                                <div key={blocker._id} className={`p-5 bg-[#111111] border rounded-2xl group transition-all shadow-xl ${blocker.escalated ? 'border-rose-500/50' : 'border-white/5 hover:border-white/20'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                       <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${blocker.severity === 'P0' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'}`}>
                                          {blocker.severity}
                                       </div>
                                       <div className="flex items-center space-x-1 text-slate-600">
                                          <Clock size={10} />
                                          <span className="text-[8px] font-black uppercase tracking-widest">{calculateAge(blocker.createdAt)}</span>
                                       </div>
                                    </div>
                                    
                                    <h4 className="text-xs font-bold text-white uppercase tracking-tight mb-2">{blocker.title}</h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Reporter: {blocker.reporter?.name || 'Unknown'}</p>

                                    <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                                        <button 
                                            onClick={() => handleEscalate(blocker._id)}
                                            disabled={blocker.escalated || blocker.status === 'resolved'}
                                            className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border flex items-center justify-center space-x-1 ${blocker.escalated ? 'bg-rose-500 text-white border-rose-500' : 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500 hover:text-white'}`}
                                        >
                                           <ArrowUpCircle size={10} />
                                           <span>{blocker.escalated ? 'Escalated' : 'Escalate'}</span>
                                        </button>
                                        <button className="p-2 bg-white/5 hover:bg-emerald-500/20 text-slate-500 hover:text-emerald-500 rounded-lg transition-all">
                                           <ShieldAlert size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Simple Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl w-full max-w-md p-8 relative shadow-2xl">
                        <button onClick={() => setShowReportModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white">
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6">Report <span className="text-rose-500">Blocker</span></h2>
                        <form onSubmit={handleReport} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Title</label>
                                <input 
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-rose-500/50"
                                    value={newBlocker.title}
                                    onChange={e => setNewBlocker({...newBlocker, title: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</label>
                                <textarea 
                                    required
                                    rows="3"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-rose-500/50"
                                    value={newBlocker.description}
                                    onChange={e => setNewBlocker({...newBlocker, description: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Severity</label>
                                <select 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-rose-500/50 appearance-none"
                                    value={newBlocker.severity}
                                    onChange={e => setNewBlocker({...newBlocker, severity: e.target.value})}
                                >
                                    <option value="P0" className="bg-[#0f0f0f]">P0 - Critical</option>
                                    <option value="P1" className="bg-[#0f0f0f]">P1 - High</option>
                                    <option value="P2" className="bg-[#0f0f0f]">P2 - Medium</option>
                                </select>
                            </div>
                            <button className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-rose-500/20 transition-all">
                                Submit Blocker
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlockerBoard;

