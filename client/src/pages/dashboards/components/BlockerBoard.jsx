import React from 'react';
import { AlertTriangle, Clock, User, ArrowUpCircle, CheckCircle2 } from 'lucide-react';

const BlockerBoard = ({ blockers }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'P0': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'P1': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'P2': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Blockers (Requires Immediate Attention)</h4>
        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/5">
          {blockers?.length || 0} Total
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {blockers?.map((blocker) => (
          <div 
            key={blocker.id} 
            className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.04] transition-all duration-300"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className={`px-2.5 py-1 rounded-lg border text-[10px] font-black tracking-tighter ${getSeverityColor(blocker.severity)}`}>
                {blocker.severity}
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{blocker.title}</h5>
                <div className="flex items-center space-x-4 mt-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">
                  <div className="flex items-center space-x-1.5">
                    <User size={10} />
                    <span>{blocker.owner}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock size={10} />
                    <span>{blocker.age}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-4 md:mt-0 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-rose-500/20 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/20 group/btn">
                <ArrowUpCircle size={14} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                <span>Escalate</span>
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-emerald-500/20 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20">
                <CheckCircle2 size={14} />
                <span>Resolve</span>
              </button>
            </div>
          </div>
        ))}

        {(!blockers || blockers.length === 0) && (
          <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
            <CheckCircle2 size={40} className="text-emerald-500/20 mb-3" />
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest italic">No active blockers. Team is in flow!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockerBoard;
