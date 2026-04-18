import React from 'react';
import { Search, Filter, ArrowUp, Zap, Target } from 'lucide-react';

const BacklogRefinementView = () => {
    const backlogItems = [
        { id: 1, title: 'Refactor Auth Routes', effort: 'Medium', priority: 'High', rice: 85, ready: true },
        { id: 2, title: 'Implement PDF Export', effort: 'Low', priority: 'Med', rice: 62, ready: false },
        { id: 3, title: 'Cleanup Tailwind Classes', effort: 'High', priority: 'Low', rice: 30, ready: true },
    ];

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#111111] p-6 rounded-3xl border border-white/5">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search backlog items..." 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                    />
                </div>
                <div className="flex space-x-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                        <Filter size={14} />
                        <span>Filter</span>
                    </button>
                    <button className="flex-1 md:flex-none premium-gradient px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20">
                        New Story
                    </button>
                </div>
            </div>

            <div className="bg-[#111111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/[0.02] border-b border-white/5">
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ready</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Item Details</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Rice Score</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Effort</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {backlogItems.map((item) => (
                            <tr key={item.id} className="group hover:bg-white/[0.01] transition-all">
                                <td className="px-8 py-6">
                                    <div className={`w-3 h-3 rounded-full ${item.ready ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-700'}`}></div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{item.title}</span>
                                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">Ref: ST-44{item.id}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center space-x-2 text-blue-500">
                                        <ArrowUp size={14} />
                                        <span className="text-sm font-black italic">{item.rice}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.effort}</span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="p-3 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white rounded-xl transition-all">
                                        <Zap size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-8 bg-[#111111] border border-white/5 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Target size={120} className="text-blue-500" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Refinement <span className="text-blue-500">Sprint Health</span></h3>
                    <p className="text-slate-500 text-sm font-medium">85% of your backlog items have estimated points and clear criteria.</p>
                </div>
            </div>
        </div>
    );
};

export default BacklogRefinementView;
