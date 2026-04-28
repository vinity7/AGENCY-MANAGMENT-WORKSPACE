import React, { useState } from 'react';
import AsyncStandupDashboard from './scrum/AsyncStandupDashboard';
import StandupCheckin from './scrum/StandupCheckin';

const Standup = () => {
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'form'

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Daily <span className="text-emerald-500">Standup</span></h1>
          <p className="text-slate-400 font-medium mt-1">Facilitating 24/7 async team alignment.</p>
        </div>
        
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-sm">
           <button 
             onClick={() => setView('dashboard')}
             className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'dashboard' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-white'}`}
           >
             SM Dashboard
           </button>
           <button 
             onClick={() => setView('form')}
             className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'form' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-white'}`}
           >
             Post Check-in
           </button>
        </div>
      </div>

      <div className="w-full">
         {view === 'dashboard' ? <AsyncStandupDashboard /> : <StandupCheckin />}
      </div>
    </div>
  );
};

export default Standup;
