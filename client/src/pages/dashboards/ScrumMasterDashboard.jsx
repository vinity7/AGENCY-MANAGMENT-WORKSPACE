import React from 'react';
import StatCard from './components/StatCard';
import WorkloadHeatmap from './components/WorkloadHeatmap';
import RecentActivity from './components/RecentActivity';
import QuickActions from './components/QuickActions';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Shield, Users, Zap, AlertCircle } from 'lucide-react';

const ScrumMasterDashboard = ({ data, loading }) => {
  // Mock data for velocity trend
  const velocityData = [
    { name: 'S1', points: 30, ideal: 32 },
    { name: 'S2', points: 35, ideal: 32 },
    { name: 'S3', points: 32, ideal: 34 },
    { name: 'S4', points: 40, ideal: 36 },
    { name: 'S5', points: 38, ideal: 38 },
    { name: 'S6', points: 42, ideal: 40 }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Team Velocity</h1>
          <p className="text-slate-400 font-medium">Removing blockers and optimizing flow.</p>
        </div>
        <div className="flex items-center space-x-3 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-2xl">
           <AlertCircle size={18} className="text-rose-500" />
           <span className="text-xs font-black text-white uppercase tracking-widest">2 Active Blockers</span>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions 
        actions={[
          { label: 'Facilitate Retro', path: '#' },
          { label: 'Remove Blockers', path: '#' },
          { label: 'Adjust Capacity', path: '/organization' }
        ]} 
        color="rose" 
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} loading={loading} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Velocity Trend - 8 cols */}
        <div className="lg:col-span-8 bg-[#111111] border border-white/5 rounded-3xl p-6 h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Team Velocity Trend (Points per Sprint)</h4>
            <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest">
               <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-slate-500">Completed</span>
               </div>
               <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full border border-slate-500"></div>
                  <span className="text-slate-500">Ideal</span>
               </div>
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b0b0b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="points" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6e" fillOpacity={0.1} animationDuration={2000} />
                <Line type="monotone" dataKey="ideal" stroke="#64748b" strokeWidth={1} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Happiness Meter placeholder - 4 cols */}
        <div className="lg:col-span-4 bg-[#111111] border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-6">
           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Team Happiness Meter</h4>
           <div className="relative">
              <div className="h-32 w-32 rounded-full border-8 border-white/5 flex items-center justify-center text-5xl">
                😊
              </div>
              <div className="absolute inset-0 rounded-full border-t-8 border-emerald-500" style={{ transform: 'rotate(45deg)' }}></div>
           </div>
           <div>
              <p className="text-xl font-black text-white">4.2 / 5.0</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">Strong Team Morale</p>
           </div>
           <button className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-emerald-500/20">
              Trigger Pulse Survey
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2">
            <WorkloadHeatmap data={data?.charts.utilization} title="Member Engagement Heatmap" />
         </div>
         <RecentActivity activities={data?.activities} />
      </div>
    </div>
  );
};

export default ScrumMasterDashboard;
