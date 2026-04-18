import React, { useState } from 'react';
import SprintPlanningWorkspace from './scrum/SprintPlanningWorkspace';
import BacklogRefinementView from './scrum/BacklogRefinementView';

const Sprints = () => {
  const [activeTab, setActiveTab] = useState('planning');

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Sprint <span className="text-blue-500">Command</span></h1>
          <p className="text-slate-400 font-medium mt-1">Operational hub for planning and capacity negotiation.</p>
        </div>
        
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-sm">
           <button 
             onClick={() => setActiveTab('planning')}
             className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'planning' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}
           >
             Sprint Planning
           </button>
           <button 
             onClick={() => setActiveTab('backlog')}
             className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'backlog' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}
           >
             Backlog Refinement
           </button>
        </div>
      </div>

      <div className="w-full">
         {activeTab === 'planning' ? <SprintPlanningWorkspace /> : <BacklogRefinementView />}
      </div>
    </div>
  );
};

export default Sprints;
