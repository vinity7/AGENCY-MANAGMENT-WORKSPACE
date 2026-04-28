import React, { useState } from 'react';
import { Target, TrendingUp, Layers, CheckCircle2, Calculator, X, Info } from 'lucide-react';
import api from '../../api/axios';

const InitiativeCard = ({ initiative, onUpdate }) => {
  const [showRiceModal, setShowRiceModal] = useState(false);
  const [riceData, setRiceData] = useState({
    reach: initiative.reach || 0,
    impact: initiative.impact || 1,
    confidence: initiative.confidence || 0.8,
    effort: initiative.effort || 1
  });

  const handleRiceUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/v1/roadmap/initiatives/${initiative._id}`, riceData);
      setShowRiceModal(false);
      onUpdate();
    } catch (err) {
      console.error('RICE update error:', err);
    }
  };

  const handleConvertToBacklog = async () => {
    try {
      await api.post(`/v1/roadmap/initiatives/${initiative._id}/convert-to-backlog`);
      onUpdate();
    } catch (err) {
      console.error('Convert error:', err);
    }
  };

  return (
    <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 group hover:border-blue-500/30 transition-all duration-500 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
         <Target size={64} className="text-blue-500" />
      </div>

      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/20">
          {initiative.targetQuarter}
        </span>
        <div className={`w-2 h-2 rounded-full ${initiative.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-500'}`}></div>
      </div>

      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{initiative.title}</h3>
      
      <div className="flex items-center justify-between mt-6 bg-white/[0.02] p-4 rounded-xl border border-white/5">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">RICE Score</span>
          <div className="flex items-center space-x-1.5 text-blue-500">
             <Calculator size={12} />
             <span className="text-sm font-black">{initiative.riceScore || 0}</span>
          </div>
        </div>
        <button 
          onClick={() => setShowRiceModal(true)}
          className="p-2 hover:bg-white/5 rounded-lg text-slate-600 hover:text-white transition-all"
        >
          <Info size={14} />
        </button>
      </div>

      <div className="flex items-center space-x-4 mt-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Business Value</span>
          <div className="flex items-center space-x-1.5 text-emerald-500">
             <TrendingUp size={12} />
             <span className="text-xs font-black">{initiative.businessValue}</span>
          </div>
        </div>
        <div className="h-8 w-px bg-white/5"></div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Impact</span>
          <div className="flex items-center space-x-1.5 text-blue-500">
             <Layers size={12} />
             <span className="text-xs font-black">{initiative.impact === 3 ? 'Massive' : initiative.impact === 2 ? 'High' : 'Medium'}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
        <button 
          onClick={handleConvertToBacklog}
          className="flex-1 py-2.5 bg-white/5 hover:bg-blue-600 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white rounded-xl transition-all border border-white/5 hover:border-blue-500 flex items-center justify-center space-x-2"
        >
           <CheckCircle2 size={12} />
           <span>Convert to Backlog</span>
        </button>
      </div>

      {/* RICE Scoring Modal */}
      {showRiceModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl w-full max-w-md p-8 relative shadow-2xl">
            <button onClick={() => setShowRiceModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white">
                <X size={20} />
            </button>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-2">RICE <span className="text-blue-500">Scoring</span></h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8">Reach * Impact * Confidence / Effort</p>
            
            <form onSubmit={handleRiceUpdate} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reach (Users/Q)</label>
                        <input 
                            type="number"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50"
                            value={riceData.reach}
                            onChange={e => setRiceData({...riceData, reach: Number(e.target.value)})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Impact (0.1 - 3)</label>
                        <select 
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50 appearance-none"
                            value={riceData.impact}
                            onChange={e => setRiceData({...riceData, impact: Number(e.target.value)})}
                        >
                            <option value="3" className="bg-[#0f0f0f]">3 - Massive</option>
                            <option value="2" className="bg-[#0f0f0f]">2 - High</option>
                            <option value="1" className="bg-[#0f0f0f]">1 - Medium</option>
                            <option value="0.5" className="bg-[#0f0f0f]">0.5 - Low</option>
                            <option value="0.25" className="bg-[#0f0f0f]">0.25 - Minimal</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confidence (%)</label>
                        <select 
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50 appearance-none"
                            value={riceData.confidence}
                            onChange={e => setRiceData({...riceData, confidence: Number(e.target.value)})}
                        >
                            <option value="1" className="bg-[#0f0f0f]">100% - High</option>
                            <option value="0.8" className="bg-[#0f0f0f]">80% - Medium</option>
                            <option value="0.5" className="bg-[#0f0f0f]">50% - Low</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Effort (Points)</label>
                        <input 
                            type="number"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50"
                            value={riceData.effort}
                            onChange={e => setRiceData({...riceData, effort: Number(e.target.value)})}
                        />
                    </div>
                </div>
                
                <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex justify-between items-center">
                    <span className="text-xs font-black text-white uppercase tracking-widest">Projected RICE Score</span>
                    <span className="text-2xl font-black text-blue-500">
                        {Math.round((riceData.reach * riceData.impact * riceData.confidence / (riceData.effort || 1)) * 10) / 10}
                    </span>
                </div>

                <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 transition-all">
                    Update Strategy Score
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InitiativeCard;

