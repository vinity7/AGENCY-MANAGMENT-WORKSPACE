import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Flame, ShieldCheck, Activity } from 'lucide-react';

const ImpedimentHeatmap = () => {
    const data = [
        { area: 'Frontend', count: 12, color: '#f43f5e' },
        { area: 'API', count: 8, color: '#f59e0b' },
        { area: 'DevOps', count: 5, color: '#3b82f6' },
        { area: 'QA', count: 3, color: '#10b981' },
    ];

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#111111] p-8 rounded-3xl border border-white/5 space-y-4">
                    <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl w-fit">
                        <Flame size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Avg resolution time</p>
                        <h3 className="text-3xl font-black text-white">4.2 <span className="text-sm text-slate-700">hours</span></h3>
                    </div>
                </div>
                <div className="bg-[#111111] p-8 rounded-3xl border border-white/5 space-y-4">
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Blockers resolved</p>
                        <h3 className="text-3xl font-black text-white">96%</h3>
                    </div>
                </div>
                <div className="bg-[#111111] p-8 rounded-3xl border border-white/5 space-y-4">
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl w-fit">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Velocity impact</p>
                        <h3 className="text-3xl font-black text-white">-12%</h3>
                    </div>
                </div>
            </div>

            <div className="bg-[#111111] border border-white/5 rounded-3xl p-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Friction <span className="text-rose-500">Distribution</span></h3>
                        <p className="text-slate-500 text-sm font-medium">Categorization of impediments by technical area.</p>
                    </div>
                </div>
                
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                            <XAxis 
                                dataKey="area" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} 
                                dy={10} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} 
                            />
                            <Tooltip 
                                cursor={{ fill: 'rgba(255,255,255,0.01)' }}
                                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            />
                            <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ImpedimentHeatmap;
