import React from 'react';
import { MessageSquare, ThumbsUp, CheckSquare, Plus, Zap } from 'lucide-react';

const RetrospectiveHub = () => {
    const columns = [
        { id: 'well', title: 'What went well', color: 'emerald', emoji: '🎉' },
        { id: 'wrong', title: 'What went wrong', color: 'rose', emoji: '🛑' },
        { id: 'improve', title: 'What to improve', color: 'amber', emoji: '⚡' }
    ];

    const cards = [
        { id: 1, text: 'Great coordination on the API migration!', col: 'well', sentiment: 'positive', votes: 5 },
        { id: 2, text: 'The standalone tests are still slow.', col: 'wrong', sentiment: 'negative', votes: 3 },
    ];

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {columns.map(col => (
                    <div key={col.id} className="space-y-6">
                        <div className="flex items-center space-x-3 border-b border-white/5 pb-4">
                           <span className="text-2xl">{col.emoji}</span>
                           <h3 className={`text-sm font-black uppercase tracking-widest ${col.color === 'emerald' ? 'text-emerald-500' : col.color === 'rose' ? 'text-rose-500' : 'text-amber-500'}`}>
                               {col.title}
                           </h3>
                        </div>
                        
                        <div className="space-y-4">
                            <button className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-slate-600 hover:text-white hover:border-white/10 transition-all flex items-center justify-center space-x-2 group">
                                <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Add Insight</span>
                            </button>

                            {cards.filter(c => c.col === col.id).map(card => (
                                <div key={card.id} className="p-6 bg-[#111111] border border-white/5 rounded-2xl shadow-xl hover:-translate-y-1 transition-all group">
                                   <p className="text-sm text-slate-300 font-medium leading-relaxed italic">"{card.text}"</p>
                                   <div className="mt-6 flex justify-between items-center">
                                      <div className="flex items-center space-x-2">
                                         <div className={`w-1.5 h-1.5 rounded-full ${card.sentiment === 'positive' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`}></div>
                                         <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{card.sentiment}</span>
                                      </div>
                                      <div className="flex items-center space-x-1.5 text-slate-500 group-hover:text-blue-500 transition-colors cursor-pointer">
                                         <ThumbsUp size={12} />
                                         <span className="text-[10px] font-bold">{card.votes}</span>
                                      </div>
                                   </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Item Pipeline */}
            <div className="bg-[#111111] border border-white/5 rounded-3xl p-10 mt-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <CheckSquare size={120} className="text-blue-500" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-10 mb-10">
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Commitment <span className="text-blue-500">Pipeline</span></h3>
                        <p className="text-slate-500 text-sm font-medium mt-1">Converting retrospective insights into measurable action items.</p>
                    </div>
                    <button className="premium-gradient px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 whitespace-nowrap">
                        New Commitment
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2].map(i => (
                        <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-emerald-500/30 transition-all">
                            <div className="flex justify-between mb-4">
                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${i === 1 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                                    {i === 1 ? 'Process' : 'Backlog'}
                                </span>
                                <div className="text-slate-700 group-hover:text-emerald-500 transition-colors"><Zap size={14} /></div>
                            </div>
                            <p className="text-sm font-bold text-slate-200 mb-4 tracking-tight">Timebox daily standups to exactly 15 minutes.</p>
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-600 border border-[#111] flex items-center justify-center text-[8px] font-black">SM</div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Pending</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RetrospectiveHub;
