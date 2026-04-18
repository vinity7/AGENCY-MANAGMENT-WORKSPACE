import React from 'react';
import StatCard from './components/StatCard';
import RecentActivity from './components/RecentActivity';
import { Briefcase, FileText, CheckCircle, Clock } from 'lucide-react';

const ClientPortalDashboard = ({ data, loading }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Project Portal</h1>
          <p className="text-slate-400 font-medium">Tracking your agency engagement and project status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Projects" value="2" trend="On Track" color="blue" loading={loading} />
        <StatCard title="Pending Invoices" value="1" trend="Action Needed" color="rose" loading={loading} />
        <StatCard title="Overall Progress" value="68%" trend="+4%" color="emerald" loading={loading} />
        <StatCard title="Next Milestone" value="Oct 24" trend="v1.0 Demo" color="amber" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111111] border border-white/5 rounded-3xl p-6">
           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Current Projects</h4>
           <div className="space-y-4">
              {[
                { name: 'Branding & Identity', progress: 85, health: 'Good' },
                { name: 'Mobile App MVP', progress: 42, health: 'Steady' }
              ].map((p, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                   <div className="flex justify-between items-center">
                      <h5 className="font-black text-white leading-tight">{p.name}</h5>
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{p.health}</span>
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                         <span>Development Progress</span>
                         <span>{p.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${p.progress}%` }}></div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
        <RecentActivity activities={[
          { user: 'Account Manager', action: 'uploaded file', target: 'Logo_Final.v2', time: '1 day ago' },
          { user: 'System', action: 'generated invoice', target: '#INV-0042', time: '2 days ago' }
        ]} />
      </div>
    </div>
  );
};

export default ClientPortalDashboard;
