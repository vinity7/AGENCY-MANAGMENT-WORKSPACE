import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

const SprintProgress = ({ data, title }) => {
  if (!data) return null;

  return (
    <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title || 'Sprint Progress'}</h4>
          <h3 className="text-xl font-black text-white mt-1">{data.completion}% Complete</h3>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <Clock size={12} className="text-blue-500" />
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{data.daysLeft} Days Left</span>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {/* Progress Bar */}
        <div className="relative h-4 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-1000 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            style={{ width: `${data.completion}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group hover:border-emerald-500/30 transition-all">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle size={14} className="text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-emerald-500">Completed</span>
            </div>
            <p className="text-xl font-black text-white">{data.doneTasks} <span className="text-xs text-slate-600 font-bold">/ {data.totalTasks}</span></p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group hover:border-rose-500/30 transition-all">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle size={14} className="text-rose-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-rose-500">Blockers</span>
            </div>
            <p className="text-xl font-black text-white">2 <span className="text-xs text-slate-600 font-bold">active</span></p>
          </div>
        </div>
      </div>

      <div className="mt-8">
         <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] text-center">Sprint ends on Monday, Oct 24th</p>
      </div>
    </div>
  );
};

export default SprintProgress;
