import React from 'react';
import StatCard from './components/StatCard';
import PriorityChart from './components/PriorityChart';
import RecentActivity from './components/RecentActivity';
import SprintProgress from './components/SprintProgress';
import QuickActions from './components/QuickActions';
import { Layers, Target, Users, Zap } from 'lucide-react';

const ProductOwnerDashboard = ({ data, loading }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Backlog Strategy</h1>
          <p className="text-slate-400 font-medium">Maximizing product value and team focus.</p>
        </div>
        <div className="flex items-center space-x-4">
           <div className="flex items-center space-x-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl">
              <Zap size={18} className="text-emerald-500" />
              <div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-tight">Backlog Health</p>
                <p className="text-sm font-black text-white leading-tight">84% Refined</p>
              </div>
           </div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions 
        actions={[
          { label: 'Create Epic', path: '/projects' },
          { label: 'Prioritize Backlog', path: '/tasks' },
          { label: 'Request Feedback', path: '#' }
        ]} 
        color="orange" 
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {(data?.stats || []).map((stat, idx) => (
          <StatCard key={idx} {...stat} loading={loading} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* RICE Priority Matrix - 8 cols */}
        <div className="lg:col-span-8">
          <PriorityChart data={data?.charts?.priorityMatrix || []} />
        </div>

        {/* Sprint Status - 4 cols */}
        <div className="lg:col-span-4">
          <SprintProgress data={data?.charts?.sprintProgress || {}} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Release Timeline / Stakeholder Panel placeholder */}
         <div className="bg-[#111111] border border-white/5 rounded-3xl p-6">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Upcoming Milestones</h4>
            <div className="space-y-4">
               {[
                 { date: 'Oct 28', event: 'v2.1 API Release', status: 'On Track' },
                 { date: 'Nov 05', event: 'Client Portal MVP', status: 'Pending Review' },
                 { date: 'Nov 12', event: 'AI Engine Integration', status: 'Risk: High' }
               ].map((m, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-all">
                    <div className="flex items-center space-x-4">
                       <div className="flex flex-col items-center justify-center h-12 w-12 bg-white/5 rounded-xl border border-white/5 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">Oct</span>
                          <span className="text-sm font-black tracking-tight">{m.date.split(' ')[1]}</span>
                       </div>
                       <div>
                          <p className="font-bold text-slate-200">{m.event}</p>
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${m.status.includes('Risk') ? 'text-rose-500' : 'text-slate-500'}`}>{m.status}</p>
                       </div>
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

export default ProductOwnerDashboard;
