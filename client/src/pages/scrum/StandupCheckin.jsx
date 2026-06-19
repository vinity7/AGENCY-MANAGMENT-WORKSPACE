import React, { useState } from 'react';
import { Send, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const StandupCheckin = () => {
    const [formData, setFormData] = useState({
        yesterday: '',
        today: '',
        blockers: '',
        hasBlocker: false
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await api.post('/v1/scrum/standups', {
                yesterday: formData.yesterday,
                today: formData.today,
                blockers: formData.hasBlocker ? formData.blockers : 'None',
                hasBlocker: formData.hasBlocker
            });
            
            setStatus({ type: 'success', message: 'Team update sent successfully!' });
            setFormData({ yesterday: '', today: '', blockers: '', hasBlocker: false });
        } catch (err) {
            console.error('Standup submission error:', err);
            setStatus({ 
                type: 'error', 
                message: err.response?.data?.msg || 'Failed to send update. Please try again.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-[#111111] border border-white/5 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Send size={120} className="text-emerald-500" />
            </div>

            <div className="relative z-10 space-y-8">
                <div>
                   <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Your Daily <span className="text-emerald-500">Pulse</span></h2>
                   <p className="text-slate-500 text-sm font-medium">Keep the team in flow. Your update is shared with the org.</p>
                </div>

                {status.message && (
                    <div className={`p-4 rounded-2xl text-xs font-bold uppercase tracking-widest ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">What did you accomplish yesterday?</label>
                           <textarea 
                             className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm text-slate-200 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700"
                             placeholder="e.g. Completed the auth middleware and integrated socket.io"
                             rows="3"
                             required
                             value={formData.yesterday}
                             onChange={(e) => setFormData({...formData, yesterday: e.target.value})}
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">What's the mission for today?</label>
                           <textarea 
                             className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm text-slate-200 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700"
                             placeholder="e.g. Building the RoadmapTimeline and InitiativeCard components"
                             rows="3"
                             required
                             value={formData.today}
                             onChange={(e) => setFormData({...formData, today: e.target.value})}
                           />
                        </div>

                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Any blockers or impediments?</label>
                              <button 
                                type="button"
                                onClick={() => setFormData({...formData, hasBlocker: !formData.hasBlocker})}
                                className={`flex items-center space-x-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${formData.hasBlocker ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-white/5 text-slate-500'}`}
                              >
                                 <AlertTriangle size={10} />
                                 <span>{formData.hasBlocker ? 'Report Active Blocker' : 'No Blockers'}</span>
                              </button>
                           </div>
                           
                           {formData.hasBlocker && (
                              <textarea 
                                className="w-full bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4 text-sm text-rose-200 focus:border-rose-500/50 outline-none transition-all animate-in slide-in-from-top-2"
                                placeholder="Describe exactly what's blocking you..."
                                rows="3"
                                required={formData.hasBlocker}
                                value={formData.blockers}
                                onChange={(e) => setFormData({...formData, blockers: e.target.value})}
                              />
                           )}
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/10 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                       <span>{loading ? 'Sending...' : 'Send Team Update'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StandupCheckin;

