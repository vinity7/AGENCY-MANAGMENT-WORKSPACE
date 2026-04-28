import React from 'react';
import { MoreVertical, ChevronRight } from 'lucide-react';

const TaskList = ({ tasks, title }) => {
  const getPriorityColor = (p) => {
    switch (p?.toLowerCase()) {
      case 'high': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'med': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title || 'My Focus List'}</h4>
          <button className="p-2 text-slate-600 hover:text-white transition-colors">
            <MoreVertical size={16} />
          </button>
       </div>

       <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
          {tasks?.map((task) => (
            <div key={task.id} className="group bg-white/5 border border-white/5 p-4 rounded-2xl hover:border-blue-500/30 transition-all cursor-pointer">
               <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <ChevronRight size={14} className="text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
               </div>
               <p className="font-bold text-white text-sm mb-1">{task.name}</p>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{task.project}</p>
            </div>
          ))}
          
          {(!tasks || tasks.length === 0) && (
            <div className="text-center py-20 opacity-30">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No active tasks</p>
            </div>
          )}
       </div>

       <div className="mt-6">
          <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5">
            View All Tasks
          </button>
       </div>
    </div>
  );
};

export default TaskList;
