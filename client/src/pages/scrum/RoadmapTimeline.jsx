import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

const RoadmapTimeline = ({ initiatives }) => {
  const columns = [
    { id: 'now', title: 'Now (Active)', subtitle: 'Executing this quarter', color: 'blue' },
    { id: 'next', title: 'Next (Planning)', subtitle: 'Next 3-6 months', color: 'purple' },
    { id: 'later', title: 'Later (Discovery)', subtitle: 'Future horizon', color: 'slate' }
  ];

  const getStatusColor = (color) => {
    switch (color) {
      case 'blue': return 'text-blue-500 border-blue-500/20 bg-blue-500/5';
      case 'purple': return 'text-purple-500 border-purple-500/20 bg-purple-500/5';
      default: return 'text-slate-500 border-white/10 bg-white/5';
    }
  };

  return (
    <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 h-full flex flex-col">
      <div className="flex items-center space-x-3 mb-10">
        <Calendar size={18} className="text-blue-500" />
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Horizon Timeline</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
        {columns.map((col) => (
          <div key={col.id} className="flex flex-col space-y-6">
             <div className="space-y-1">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">{col.title}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{col.subtitle}</p>
             </div>
             
             <div className={`flex-1 rounded-2xl border-2 border-dashed ${getStatusColor(col.color)} p-4 space-y-4 min-h-[400px]`}>
                 {/* Placeholder for items in this horizon */}
                 <div className="p-4 bg-white/5 border border-white/5 rounded-xl group cursor-move hover:border-blue-500/30 transition-all">
                    <p className="text-xs font-bold text-slate-300">Feature: Global Payment Gateway</p>
                    <div className="flex justify-between items-center mt-3">
                       <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Priority: High</span>
                       <ArrowRight size={12} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                 </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapTimeline;
