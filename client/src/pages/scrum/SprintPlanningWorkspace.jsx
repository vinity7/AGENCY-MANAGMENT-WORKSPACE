import React, { useState } from 'react';
import { Gauge, AlertTriangle, CheckCircle2, MoreHorizontal } from 'lucide-react';

const SprintPlanningWorkspace = () => {
  const [capacity, setCapacity] = useState(40);
  const [planned, setPlanned] = useState(42);

  const isOverCapacity = planned > capacity;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left: Planning Area */}
      <div className="lg:col-span-8 space-y-8">
        <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Current Sprint #47 Planning</h3>
            <div className="flex items-center space-x-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sprint Goal:</span>
              <span className="text-sm font-bold text-white italic">"Global user onboarding flow completion"</span>
            </div>
          </div>

          <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`absolute top-0 left-0 h-full transition-all duration-1000 ${isOverCapacity ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]' : 'bg-blue-500 shadow-[0_0_15px_#3b82f6]'}`}
              style={{ width: `${Math.min((planned/capacity)*100, 100)}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Team Capacity</span>
               <div className="text-3xl font-black text-white">{capacity}<span className="text-sm text-slate-600 ml-1">pts</span></div>
            </div>
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Planned Load</span>
               <div className={`text-3xl font-black ${isOverCapacity ? 'text-rose-500' : 'text-blue-500'}`}>{planned}<span className="text-sm opacity-50 ml-1">pts</span></div>
            </div>
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Remaining</span>
               <div className="text-3xl font-black text-slate-400">{Math.max(capacity - planned, 0)}<span className="text-sm text-slate-600 ml-1">pts</span></div>
            </div>
          </div>
        </div>

        {/* Sprint Items Table */}
        <div className="bg-[#111111] border border-white/5 rounded-3xl overflow-hidden">
           <div className="p-6 border-b border-white/5">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sprint Backlog Items</h4>
           </div>
           <div className="divide-y divide-white/5">
              {[1, 2, 3].map((i) => (
                 <div key={i} className="p-6 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                    <div className="flex items-center space-x-4">
                       <CheckCircle2 size={18} className="text-blue-500/30 group-hover:text-blue-500 transition-all" />
                       <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">ST-12{i}: Core Auth Integration</p>
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Est: 5 pts</span>
                       </div>
                    </div>
                    <div className="flex items-center space-x-4">
                       {i === 1 && (
                          <div className="flex items-center space-x-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-500 text-[8px] font-black uppercase tracking-widest">
                             <AlertTriangle size={10} />
                             <span>At Risk (Capacity Overload)</span>
                          </div>
                       )}
                       <button className="text-slate-600 hover:text-white transition-colors">
                          <MoreHorizontal size={18} />
                       </button>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* Right: Backlog Selection */}
      <div className="lg:col-span-4 space-y-6">
         <div className="bg-[#111111] border border-white/5 rounded-3xl p-6">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4 text-center">Ready Backlog (Drag to Plan)</h4>
            <div className="space-y-3">
               {[4, 5, 6, 7].map(i => (
                  <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-blue-500/50 cursor-grab active:scale-95 transition-all">
                      <p className="text-xs font-bold text-white uppercase tracking-tighter">ST-14{i}: SEO Metadata Manager</p>
                      <div className="flex justify-between items-center mt-3">
                         <span className="text-[10px] font-black text-slate-600 italic">8 pts</span>
                         <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Requirement Clear</span>
                      </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default SprintPlanningWorkspace;
