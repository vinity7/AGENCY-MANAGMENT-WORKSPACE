import React from 'react';
import StatCard from './components/StatCard';
import RevenueChart from './components/RevenueChart';
import RecentActivity from './components/RecentActivity';
import WorkloadHeatmap from './components/WorkloadHeatmap';
import QuickActions from './components/QuickActions';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const OrganizationLeadDashboard = ({ data, loading }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Workspace Intelligence</h1>
          <p className="text-slate-400 font-medium">Monitoring business health and organizational capacity.</p>
        </div>
        <div className="flex items-center space-x-3 bg-white/5 p-1 rounded-2xl">
          {['Week', 'Month', 'Quarter', 'Year'].map((range) => (
            <button
              key={range}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                range === 'Month' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions actions={data?.quickActions} color="purple" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} loading={loading} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Trend - 8 cols */}
        <div className="lg:col-span-8">
          <RevenueChart data={data?.charts.revenueTrend} />
        </div>

        {/* Project Health - 4 cols */}
        <div className="lg:col-span-4 bg-[#111111] border border-white/5 rounded-3xl p-6 h-[400px] flex flex-col">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Project Health Distribution</h4>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.charts.projectHealth}
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  animationDuration={1500}
                  stroke="none"
                >
                  {data?.charts.projectHealth.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b0b0b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-white">18</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Projects</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
             {data?.charts.projectHealth.map((h, i) => (
               <div key={i} className="text-center">
                  <p className="text-[10px] font-black text-white">{h.value}</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase truncate">{h.name}</p>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <WorkloadHeatmap data={data?.charts.utilization} />
         <RecentActivity activities={data?.activities} />
      </div>
    </div>
  );
};

export default OrganizationLeadDashboard;
