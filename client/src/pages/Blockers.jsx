import React, { useState } from 'react';
import BlockerBoard from './scrum/BlockerBoard';
import ImpedimentHeatmap from './scrum/ImpedimentHeatmap';

const Blockers = () => {
  const [activeTab, setActiveTab] = useState('board');

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Impediment <span className="text-rose-500">Center</span></h1>
          <p className="text-slate-400 font-medium mt-1">SLA-driven resolution of team blockers and friction.</p>
        </div>
        
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-sm">
           <button 
             onClick={() => setActiveTab('board')}
             className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'board' ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'text-slate-500 hover:text-white'}`}
           >
             Blocker Board
           </button>
           <button 
             onClick={() => setActiveTab('analytics')}
             className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'text-slate-500 hover:text-white'}`}
           >
             Friction Analytics
           </button>
        </div>
      </div>

      <div className="w-full">
         {activeTab === 'board' ? <BlockerBoard /> : <ImpedimentHeatmap />}
      </div>
    </div>
  );
};

export default Blockers;
