import React from 'react';

const WorkloadHeatmap = ({ data, title }) => {
  const getIntensityClass = (value) => {
    if (value >= 90) return 'bg-rose-500/80 text-white';
    if (value >= 75) return 'bg-orange-500/60 text-white';
    if (value >= 50) return 'bg-blue-500/40 text-blue-100';
    if (value >= 25) return 'bg-blue-500/10 text-slate-400';
    return 'bg-white/5 text-slate-600';
  };

  return (
    <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title || 'Team Capacity Heatmap'}</h4>
        <div className="flex items-center space-x-2">
          <span className="text-[8px] font-bold text-slate-600 uppercase">Available</span>
          <div className="flex space-x-1">
            <div className="h-2 w-2 rounded-sm bg-white/5"></div>
            <div className="h-2 w-2 rounded-sm bg-blue-500/40"></div>
            <div className="h-2 w-2 rounded-sm bg-rose-500/80"></div>
          </div>
          <span className="text-[8px] font-bold text-slate-600 uppercase">Overloaded</span>
        </div>
      </div>
      
      <div className="flex-1 space-y-3">
        {data?.map((member, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-24 text-right">
               <p className="text-xs font-bold text-white truncate">{member.name}</p>
            </div>
            <div className="flex-1 h-8 rounded-xl overflow-hidden flex space-x-1">
               {/* Simulating 5 days of a week or just one intensity block for simplicity */}
               <div className={`flex-1 flex items-center justify-center text-[10px] font-black rounded-lg transition-all hover:scale-[1.05] ${getIntensityClass(member.value)}`}>
                  {member.value}%
               </div>
               <div className={`flex-1 rounded-lg ${getIntensityClass(member.value * 0.8)}`}></div>
               <div className={`flex-1 rounded-lg ${getIntensityClass(member.value * 1.1 > 100 ? 100 : member.value * 1.1)}`}></div>
               <div className={`flex-1 rounded-lg ${getIntensityClass(member.value * 0.9)}`}></div>
               <div className={`flex-1 rounded-lg ${getIntensityClass(member.value * 0.5)}`}></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
         <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Team Average</span>
            <span className="text-lg font-black text-white">79%</span>
         </div>
         <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/5 transition-all">
            Manage Capacity
         </button>
      </div>
    </div>
  );
};

export default WorkloadHeatmap;
