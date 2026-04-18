import React from 'react';
import { Clock, CheckSquare, MessageCircle, AlertCircle, ShieldCheck, Square, CheckCircle2 } from 'lucide-react';

export const MyTasksKanban = () => {
    const sections = [
        { id: 'todo', title: 'To Do', color: 'slate' },
        { id: 'doing', title: 'In Progress', color: 'blue' },
        { id: 'done', title: 'Completed', color: 'emerald' }
    ];

    const tasks = [
        { id: 1, title: 'Implement RoadmapTimeline', status: 'doing', priority: 'High', comments: 3 },
        { id: 2, title: 'Bug: Sidebar alignment', status: 'todo', priority: 'Med', comments: 0 }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sections.map(section => (
                <div key={section.id} className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">{section.title}</h3>
                    <div className="min-h-[500px] bg-white/[0.01] border border-dashed border-white/5 rounded-3xl p-4 space-y-4">
                        {tasks.filter(t => t.status === section.id).map(task => (
                            <div key={task.id} className="p-5 bg-[#111111] border border-white/5 rounded-2xl group hover:border-blue-500/30 transition-all shadow-xl">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${task.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                        {task.priority}
                                    </span>
                                    <Clock size={12} className="text-slate-600" />
                                </div>
                                <h4 className="text-sm font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">{task.title}</h4>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex items-center space-x-3 text-slate-600">
                                        <div className="flex items-center space-x-1">
                                            <MessageCircle size={12} />
                                            <span className="text-[10px] font-bold">{task.comments}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <CheckSquare size={12} />
                                            <span className="text-[10px] font-bold">2/5</span>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[8px] font-black">AH</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export const DoDChecklist = ({ items, onToggle }) => {
    return (
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="flex items-center space-x-3 text-emerald-500 border-b border-white/5 pb-4">
                <ShieldCheck size={18} />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Definition of Done</h3>
            </div>
            
            <div className="space-y-3">
                {items?.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => onToggle && onToggle(idx)}
                      className="flex items-center space-x-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl cursor-pointer hover:bg-white/5 transition-all group"
                    >
                        {item.completed ? (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                        ) : (
                            <Square size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                        )}
                        <span className={`text-xs font-medium transition-all ${item.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                            {item.text}
                        </span>
                    </div>
                ))}
            </div>
            
            <div className="pt-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Readiness Score</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase italic">80%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[80%] shadow-[0_0_10px_#10b981]"></div>
                </div>
            </div>
        </div>
    );
};
