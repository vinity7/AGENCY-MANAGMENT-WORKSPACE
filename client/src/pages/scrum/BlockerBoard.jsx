import React from 'react';
import { AlertTriangle, Clock, ShieldAlert, ArrowUpCircle } from 'lucide-react';

const BlockerBoard = () => {
    const columns = [
        { id: 'reported', title: 'Reported', color: 'slate' },
        { id: 'investigating', title: 'Investigating', color: 'blue' },
        { id: 'resolving', title: 'Resolving', color: 'emerald' },
        { id: 'resolved', title: 'Resolved', color: 'slate-muted' }
    ];

    const blockers = [
        { id: 1, title: 'API Gateway Timeout', severity: 'P0', age: '4h', reporter: 'Alex', status: 'investigating' },
        { id: 2, title: 'Asset Pipeline Broken', severity: 'P1', age: '12h', reporter: 'Sarah', status: 'reported' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {columns.map(col => (
                <div key={col.id} className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{col.title}</h3>
                        <span className="text-[10px] font-bold text-slate-800">2</span>
                    </div>
                    
                    <div className={`min-h-[600px] rounded-3xl bg-white/[0.01] border border-dashed border-white/5 p-4 space-y-4`}>
                        {blockers.filter(b => b.status === col.id).map(blocker => (
                            <div key={blocker.id} className="p-5 bg-[#111111] border border-white/5 rounded-2xl group hover:border-rose-500/50 transition-all shadow-xl">
                                <div className="flex justify-between items-start mb-4">
                                   <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${blocker.severity === 'P0' ? 'bg-rose-500 text-white' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'}`}>
                                      {blocker.severity}
                                   </div>
                                   <div className="flex items-center space-x-1 text-slate-600">
                                      <Clock size={10} />
                                      <span className="text-[8px] font-black uppercase tracking-widest">{blocker.age}</span>
                                   </div>
                                </div>
                                
                                <h4 className="text-xs font-bold text-white uppercase tracking-tight mb-2">{blocker.title}</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Reporter: {blocker.reporter}</p>

                                <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                                    <button className="flex-1 py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border border-rose-500/20 flex items-center justify-center space-x-1">
                                       <ArrowUpCircle size={10} />
                                       <span>Escalate</span>
                                    </button>
                                    <button className="p-2 bg-white/5 hover:bg-emerald-500/20 text-slate-500 hover:text-emerald-500 rounded-lg transition-all">
                                       <ShieldAlert size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BlockerBoard;
