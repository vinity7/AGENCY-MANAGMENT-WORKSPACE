import React from 'react';
import StatCard from './components/StatCard';
import RevenueChart from './components/RevenueChart';
import RecentActivity from './components/RecentActivity';
import QuickActions from './components/QuickActions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Layers, Target, TrendingUp, Users } from 'lucide-react';

const ProductManagerDashboard = ({ data, loading }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Market & Roadmap</h1>
          <p className="text-slate-400 font-medium">Strategic planning and feature adoption tracking.</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-600/10 border border-blue-600/20 px-4 py-2 rounded-2xl">
           <Target size={18} className="text-blue-500" />
           <span className="text-xs font-black text-white uppercase tracking-widest">Q4 Goals: 82% met</span>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions 
        actions={[
          { label: 'Update Roadmap', path: '#' },
          { label: 'Add Initiative', path: '#' },
          { label: 'View Analytics', path: '/analytics' }
        ]} 
        color="blue" 
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} loading={loading} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Forecast - 8 cols */}
        <div className="lg:col-span-8">
          <RevenueChart data={data?.charts.revenueTrend} title="Feature Adoption vs Revenue" />
        </div>

        {/* Market Insights - 4 cols */}
        <div className="lg:col-span-4 bg-[#111111] border border-white/5 rounded-3xl p-6 flex flex-col">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Feature Adoption Rank</h4>
          <div className="flex-1 space-y-4">
             {[
               { name: 'AI Search', usage: 92, color: '#3b82f6' },
               { name: 'Dark Mode', usage: 78, color: '#7c3aed' },
               { name: 'Export PDF', usage: 64, color: '#f59e0b' },
               { name: 'Mobile Sync', usage: 42, color: '#ef4444' }
             ].map((f, i) => (
               <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                     <span className="text-white">{f.name}</span>
                     <span className="text-slate-500">{f.usage}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full rounded-full" style={{ width: `${f.usage}%`, backgroundColor: f.color }}></div>
                  </div>
               </div>
             ))}
          </div>
          <button className="mt-8 w-full py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-blue-600/20">
             Deep Dive Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-[#111111] border border-white/5 rounded-3xl p-6">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10 text-center">Strategic Roadmap (Now/Next/Later)</h4>
            <div className="grid grid-cols-3 gap-6">
               {['Now', 'Next', 'Later'].map((col) => (
                 <div key={col} className="space-y-4">
                    <div className="text-center py-2 bg-blue-600/20 border border-blue-600/30 rounded-xl">
                       <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{col}</span>
                    </div>
                    <div className="space-y-3">
                       {[1, 2].map((item) => (
                         <div key={item} className="p-3 bg-white/5 rounded-2xl border border-white/5 text-[11px] font-bold text-slate-300">
                            High-level Initiative #{item}
                         </div>
                       ))}
                    </div>
                 </div>
               ))}
            </div>
         </div>
         <RecentActivity activities={data?.activities} />
      </div>
    </div>
  );
};

export default ProductManagerDashboard;
