import React from 'react';
import { User, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';

const AsyncStandupDashboard = () => {
    const checkins = [
        { id: 1, name: 'Alex Harrison', role: 'Developer', yesterday: 'Finished API routes for PM interaction', today: 'Starting Frontend RoadmapTimeline', blockers: 'None', hasBlocker: false },
        { id: 2, name: 'Sarah Jenkins', role: 'DevOps', yesterday: 'Socket.io plumbing in shared server', today: 'Deploying staging build for review', blockers: 'DB Cluster memory spike', hasBlocker: true },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 bg-[#111111] border border-white/5 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Check-in Rate</span>
                    <div className="text-3xl font-black text-white">84%</div>
                </div>
                <div className="p-6 bg-[#111111] border border-white/5 rounded-2xl border-l-4 border-l-rose-500">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Active Blockers</span>
                    <div className="text-3xl font-black text-white">2 <span className="text-xs text-rose-500 italic uppercase">P0 priority</span></div>
                </div>
            </div>

            <div className="bg-[#111111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Team Board - Today's Status</h3>
                </div>
                
                <div className="p-8 divide-y divide-white/5">
                    {checkins.map(item => (
                        <div key={item.id} className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 group">
                            <div className="lg:col-span-3 flex items-start space-x-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500/10 transition-all">
                                    <User size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-white uppercase tracking-tighter">{item.name}</p>
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{item.role}</p>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-3 space-y-2">
                                <span className="flex items-center space-x-2 text-[8px] font-black text-slate-700 uppercase tracking-widest">
                                    <Activity size={10} />
                                    <span>Finished Yesterday</span>
                                </span>
                                <p className="text-xs text-slate-400 font-medium italic">"{item.yesterday}"</p>
                            </div>
                            
                            <div className="lg:col-span-3 space-y-2">
                                <span className="flex items-center space-x-2 text-[8px] font-black text-blue-600 uppercase tracking-widest">
                                    <Zap size={10} className="fill-blue-600/20" />
                                    <span>Planned Today</span>
                                </span>
                                <p className="text-xs text-slate-200 font-bold tracking-tight">{item.today}</p>
                            </div>
                            
                            <div className="lg:col-span-3">
                                <div className={`p-4 rounded-xl border ${item.hasBlocker ? 'bg-rose-500/5 border-rose-500/20 text-rose-400' : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500'}`}>
                                    <div className="flex items-center space-x-2 mb-2">
                                        {item.hasBlocker ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                                        <span className="text-[10px] font-black uppercase tracking-widest">Impediments</span>
                                    </div>
                                    <p className="text-xs font-medium tracking-tight h-12 overflow-hidden overflow-ellipsis">
                                        {item.blockers}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Zap = ({ size, className }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
);

export default AsyncStandupDashboard;
