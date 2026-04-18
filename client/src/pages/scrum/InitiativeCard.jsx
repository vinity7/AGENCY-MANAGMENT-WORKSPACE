import React from 'react';
import { Target, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';

const InitiativeCard = ({ title, quarter, value, status }) => {
  return (
    <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 group hover:border-blue-500/30 transition-all duration-500 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
         <Target size={64} className="text-blue-500" />
      </div>

      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/20">
          {quarter}
        </span>
        <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-500'}`}></div>
      </div>

      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{title}</h3>
      
      <div className="flex items-center space-x-4 mt-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Business Value</span>
          <div className="flex items-center space-x-1.5 text-emerald-500">
             <TrendingUp size={12} />
             <span className="text-xs font-black">{value}</span>
          </div>
        </div>
        <div className="h-8 w-px bg-white/5"></div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Alignment</span>
          <div className="flex items-center space-x-1.5 text-blue-500">
             <Layers size={12} />
             <span className="text-xs font-black">Core Product</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
        <button className="flex-1 py-2.5 bg-white/5 hover:bg-blue-600 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white rounded-xl transition-all border border-white/5 hover:border-blue-500 flex items-center justify-center space-x-2">
           <CheckCircle2 size={12} />
           <span>Convert to Backlog</span>
        </button>
      </div>
    </div>
  );
};

export default InitiativeCard;
