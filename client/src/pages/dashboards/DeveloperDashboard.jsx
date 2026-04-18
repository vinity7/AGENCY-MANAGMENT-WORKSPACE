import React from 'react';
import StatCard from './components/StatCard';
import TaskList from './components/TaskList';
import RecentActivity from './components/RecentActivity';
import QuickActions from './components/QuickActions';
import { Clock, Code, Play, CheckCircle, AlertCircle } from 'lucide-react';

const DeveloperDashboard = ({ data, loading }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Today's Focus</h1>
          <p className="text-slate-400 font-medium">Monitoring assigned tasks and implementation progress.</p>
        </div>
        <div className="flex items-center space-x-3 bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-3xl group cursor-pointer hover:bg-emerald-500/20 transition-all">
           <Play size={20} className="text-emerald-500 fill-emerald-500" />
           <div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-tight italic">Currently Tracking</p>
              <p className="text-sm font-black text-white leading-tight">Role: Dashboard Refactor</p>
           </div>
           <div className="ml-4 font-mono font-bold text-white text-lg">01:42:05</div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions 
        actions={[
          { label: 'Log Time', path: '/tasks' },
          { label: 'Request Review', path: '#' },
          { label: 'Report Blocker', path: '#' }
        ]} 
        color="emerald" 
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} loading={loading} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Task Board Columns - 8 cols */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
           <TaskList 
             title="Ready to Start" 
             tasks={data?.charts.tasks.todo} 
           />
           <TaskList 
             title="In Progress" 
             tasks={data?.charts.tasks.doing} 
           />
        </div>

        {/* Focus & Blockers - 4 cols */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-[#111111] border border-white/5 rounded-3xl p-6">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Sprint Engagement</h4>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-bold text-slate-300">Target Points</span>
                       <span className="text-xs font-black text-white">12 / 18</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-600 rounded-full" style={{ width: '66%' }}></div>
                    </div>
                 </div>
                 <div className="flex items-center space-x-4 p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
                    <AlertCircle size={24} className="text-rose-500" />
                    <div>
                       <p className="text-xs font-bold text-white">Active Blocker</p>
                       <p className="text-[10px] text-rose-500 uppercase font-black tracking-widest">Waiting for API Specs</p>
                    </div>
                 </div>
              </div>
           </div>
           
           <RecentActivity activities={data?.activities} />
        </div>

      </div>

    </div>
  );
};

export default DeveloperDashboard;
