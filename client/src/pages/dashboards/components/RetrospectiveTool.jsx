import React from 'react';
import { MessageSquare, ThumbsUp, CheckSquare, Plus } from 'lucide-react';

const RetrospectiveTool = ({ data }) => {
  return (
    <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 flex flex-col space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sprint Retrospective (Continuous Improvement)</h4>
          <p className="text-xs text-slate-400 mt-1">Collecting anonymous feedback for Sprint 46.</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-blue-500/20">
          <Plus size={14} />
          <span>New Feedback</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feedback Section */}
        <div className="space-y-4">
          <h5 className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">
            <MessageSquare size={12} className="text-blue-500" />
            <span>Community Feedback</span>
          </h5>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {data?.feedback?.map((item) => (
              <div key={item.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-blue-500/20 transition-all">
                <p className="text-sm text-slate-300 italic">"{item.text}"</p>
                <div className="flex justify-between items-center mt-3">
                  <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border ${
                    item.category === 'process' ? 'text-amber-500 border-amber-500/20 bg-amber-500/10' :
                    item.category === 'celebration' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10' :
                    'text-blue-500 border-blue-500/20 bg-blue-500/10'
                  }`}>
                    {item.category}
                  </span>
                  <div className="flex items-center space-x-1.5 text-slate-500 group-hover:text-blue-500 transition-colors cursor-pointer">
                    <ThumbsUp size={12} />
                    <span className="text-[10px] font-bold">{item.votes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Items Section */}
        <div className="space-y-4">
          <h5 className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">
            <CheckSquare size={12} className="text-emerald-500" />
            <span>Commitments / Action Items</span>
          </h5>
          <div className="space-y-3">
            {data?.actionItems?.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                  item.status === 'In Progress' ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-white/10 text-transparent'
                }`}>
                  <CheckSquare size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-200">{item.text}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Owner: {item.owner}</p>
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                  item.status === 'In Progress' ? 'text-amber-500 bg-amber-500/10' : 'text-slate-500 bg-white/5'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
            <button className="w-full py-3 bg-white/5 border border-dashed border-white/10 rounded-2xl text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:bg-white/10 transition-all mt-4">
              Add Action Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetrospectiveTool;
