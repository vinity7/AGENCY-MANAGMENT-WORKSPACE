import React from 'react';
import StatCard from './components/StatCard';
import BlockerBoard from './components/BlockerBoard';
import BurndownChart from './components/BurndownChart';
import HappinessMeter from './components/HappinessMeter';
import RetrospectiveTool from './components/RetrospectiveTool';
import QuickActions from './components/QuickActions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Shield, Users, Zap, AlertCircle, Calendar } from 'lucide-react';

const ScrumMasterDashboard = ({ data, loading }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Scrum Master <span className="text-blue-500">Workspace</span></h1>
          <p className="text-slate-400 font-medium">Sprint 46 Progress & Team Facilitation</p>
        </div>
        <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
           <Calendar size={18} className="text-blue-500" />
           <span className="text-xs font-black text-white uppercase tracking-widest italic">Day 7 of 14</span>
        </div>
      </div>

      {/* Row 1: Key Stats Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Core Sprint Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatCard title="Current Sprint" value="Sprint 46" trend="8 days left" color="blue" loading={loading} />
          <StatCard title="Points Progress" value="45 / 60" trend="75% Complete" color="indigo" loading={loading} />
        </div>
        {/* Team Health Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatCard title="Team Happiness" value="4.2 / 5.0" trend="+0.1 this week" color="emerald" loading={loading} />
          <StatCard title="Open Impediments" value="2" trend="Action Required" color="rose" loading={loading} />
        </div>
      </div>

      {/* Row 2: Active Blockers Board (Full Width) */}
      <div className="w-full">
        <BlockerBoard blockers={data?.blockers} />
      </div>

      {/* Row 3: Charts (Burndown & Velocity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <BurndownChart data={data?.charts?.burndown} />
        </div>
        <div className="lg:col-span-5 bg-[#111111] border border-white/5 rounded-3xl p-6 flex flex-col h-[350px]">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Velocity Trend (Last 6 Sprints)</h4>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.charts?.velocity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9, fontWeight: 700 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b0b0b', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                />
                <Bar dataKey="points" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 4: Team Sentiment & Retrospective */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <HappinessMeter score={4.2} trend={data?.charts?.happiness} />
        </div>
        <div className="lg:col-span-8">
          <RetrospectiveTool data={data?.retrospective} />
        </div>
      </div>

      {/* Final Row: Quick Actions */}
      <div className="glass-card p-8 rounded-3xl border border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">SM Command Center</h4>
            <p className="text-sm text-slate-400 font-medium">Standard facilitator ceremonies and tools.</p>
          </div>
          <QuickActions 
            actions={[
              { label: 'Facilitate Standup', path: '#' },
              { label: 'Start Retrospective', path: '#' },
              { label: 'Request help', path: '#' },
              { label: 'View Metrics', path: '#' }
            ]} 
            color="blue" 
          />
        </div>
      </div>
    </div>
  );
};

export default ScrumMasterDashboard;
