import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, ShieldAlert, ArrowUpCircle, Plus, Loader2, X, Check } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

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

    const handleResolve = async (id) => {
        try {
            await api.patch(`/v1/blockers/${id}/resolve`);
            
            // Optimistic update
            setBlockers(prev => prev.map(b => b._id === id ? { ...b, status: 'resolved' } : b));
            // Trigger fetch to ensure we have latest synced state
            fetchBlockers();
        } catch (err) {
            console.error('Resolution error:', err);
            alert(err.response?.data?.msg || 'Failed to resolve blocker');
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
            alert(err.response?.data?.msg || 'Failed to report blocker');
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
                    className="flex items-center space-x-2 px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                >
                    <Plus size={16} />
                    <span>Report Blocker</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {columns.map(col => {
                    const colBlockers = blockers.filter(b => b.status === col.id);
                    return (
                        <div key={col.id} className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{col.title}</h3>
                                <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full font-mono">
                                    {colBlockers.length}
                                </span>
                            </div>
                            
                            <div className="min-h-[600px] rounded-3xl bg-white/[0.01] border-2 border-dashed border-white/5 p-4 space-y-4">
                                {colBlockers.map(blocker => {
                                    const isCriticalP0 = blocker.severity === 'P0';
                                    const isHighP1 = blocker.severity === 'P1';
                                    
                                    // Severity styling card states
                                    let cardStyle = 'border-white/5 bg-[#111111]';
                                    if (blocker.status !== 'resolved') {
                                        if (isCriticalP0) {
                                            cardStyle = 'border-rose-500/40 bg-rose-950/15 shadow-[0_0_20px_rgba(239,68,68,0.08)]';
                                        } else if (isHighP1) {
                                            cardStyle = 'border-amber-500/30 bg-amber-950/10 shadow-[0_0_15px_rgba(245,158,11,0.05)]';
                                        } else {
                                            cardStyle = 'border-white/5 hover:border-white/10 bg-[#111111]';
                                        }
                                    } else {
                                        cardStyle = 'border-white/5 bg-[#0b0b0b] opacity-60';
                                    }

                                    return (
                                        <div key={blocker._id} className={`p-5 border rounded-2xl group transition-all shadow-xl relative ${cardStyle}`}>
                                            
                                            {/* Flash warning border for P0 critical active blocker */}
                                            {isCriticalP0 && blocker.status !== 'resolved' && (
                                                <div className="absolute inset-0 rounded-2xl border border-rose-500 animate-pulse pointer-events-none opacity-40"></div>
                                            )}

                                            <div className="flex justify-between items-start mb-4">
                                               <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                                                   blocker.severity === 'P0' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 
                                                   blocker.severity === 'P1' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                                                   'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                               }`}>
                                                  {blocker.severity}
                                               </div>
                                               <div className="flex items-center space-x-1 text-slate-500">
                                                  <Clock size={10} />
                                                  <span className="text-[8px] font-black uppercase tracking-widest">{calculateAge(blocker.createdAt)}</span>
                                               </div>
                                            </div>
                                            
                                            <h4 className="text-xs font-bold text-white uppercase tracking-tight mb-2 flex items-center gap-1.5">
                                                {isCriticalP0 && blocker.status !== 'resolved' && <AlertTriangle size={12} className="text-rose-500 animate-bounce" />}
                                                {blocker.title}
                                            </h4>
                                            
                                            <p className="text-xs text-slate-400 italic mb-4 line-clamp-3">"{blocker.description}"</p>
                                            
                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-2">Reporter: {blocker.reporter?.name || 'Unknown'}</p>

                                            <div className="mt-5 pt-4 border-t border-white/5 flex gap-2">
                                                <button 
                                                    onClick={() => handleEscalate(blocker._id)}
                                                    disabled={blocker.escalated || blocker.status === 'resolved'}
                                                    className={`flex-grow py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border flex items-center justify-center space-x-1 ${
                                                        blocker.escalated 
                                                            ? 'bg-rose-500 text-white border-rose-500' 
                                                            : 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500 hover:text-white disabled:opacity-30 disabled:hover:bg-rose-500/10 disabled:hover:text-rose-500'
                                                    }`}
                                                >
                                                   <ArrowUpCircle size={10} />
                                                   <span>{blocker.escalated ? 'Escalated' : 'Escalate'}</span>
                                                </button>
                                                
                                                {blocker.status !== 'resolved' && (
                                                    <button 
                                                        onClick={() => handleResolve(blocker._id)}
                                                        className="px-3 bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/20 hover:border-emerald-600 text-emerald-500 hover:text-white rounded-lg transition-all flex items-center justify-center"
                                                        title="Resolve Blocker"
                                                    >
                                                       <Check size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {colBlockers.length === 0 && (
                                    <div className="py-20 text-center text-slate-700 text-[10px] font-black uppercase tracking-widest">
                                        No items
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Simple Report Modal */}
            <Modal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                title="Report Blocker"
            >
                <form onSubmit={handleReport} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Blocker Title</label>
                        <input 
                            required
                            placeholder="e.g. Database connection timeouts in production"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-rose-500/50"
                            value={newBlocker.title}
                            onChange={e => setNewBlocker({...newBlocker, title: e.target.value})}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Description / Scope of Impediment</label>
                        <textarea 
                            required
                            rows="3"
                            placeholder="Describe exactly what is blocking you and who is impacted..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-rose-500/50"
                            value={newBlocker.description}
                            onChange={e => setNewBlocker({...newBlocker, description: e.target.value})}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Severity Level</label>
                        <select 
                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-rose-500/50 appearance-none font-sans"
                            value={newBlocker.severity}
                            onChange={e => setNewBlocker({...newBlocker, severity: e.target.value})}
                        >
                            <option value="P0" className="bg-[#0f0f0f]">P0 - Critical (Entire pipeline blocked)</option>
                            <option value="P1" className="bg-[#0f0f0f]">P1 - High (Major feature blocked)</option>
                            <option value="P2" className="bg-[#0f0f0f]">P2 - Medium (Minor annoyance / workaround exists)</option>
                        </select>
                    </div>
                    
                    <button className="w-full py-4 mt-4 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                        Publish Blocker Alert
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default BlockerBoard;
