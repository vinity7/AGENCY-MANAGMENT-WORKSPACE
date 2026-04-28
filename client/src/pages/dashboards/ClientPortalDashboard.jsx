import React from 'react';
import StatCard from './components/StatCard';
import { Briefcase, FileText, CheckCircle, Clock } from 'lucide-react';

const ClientPortalDashboard = ({ data, loading }) => {
  const stats = data?.counts || {};
  const activeProjects = data?.activeProjects || [];
  const invoices = data?.invoices || [];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Project Portal</h1>
          <p className="text-slate-400 font-medium">Tracking your agency engagement and project status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Projects" value={stats.projects || 0} trend="Real-time" color="blue" loading={loading} />
        <StatCard title="Active Invoices" value={stats.invoices || 0} trend="Current" color="rose" loading={loading} />
        <StatCard title="Task Progress" value={`${stats.completedTasks || 0}/${stats.tasks || 0}`} trend="Tasks" color="emerald" loading={loading} />
        <StatCard title="Pending Review" value={stats.pendingTasks || 0} trend="Action" color="amber" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Projects Section */}
        <div className="bg-[#111111] border border-white/5 rounded-3xl p-8">
           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 border-b border-white/5 pb-4">Current Projects</h4>
           <div className="space-y-6">
              {activeProjects.length > 0 ? activeProjects.map((p, i) => {
                const progress = p.status === 'Completed' ? 100 : (p.status === 'In Progress' ? 65 : 20);
                return (
                  <div key={p._id || i} className="group cursor-default">
                    <div className="flex justify-between items-center mb-3">
                        <h5 className="font-black text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors">{p.name}</h5>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${p.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-400'}`}>
                            {p.status}
                        </span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-[8px] font-black text-slate-600 uppercase tracking-widest">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_#2563eb]" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-10">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">No active projects found.</p>
                </div>
              )}
           </div>
        </div>

        {/* Invoices Section */}
        <div className="bg-[#111111] border border-white/5 rounded-3xl p-8">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 border-b border-white/5 pb-4">Recent Invoices</h4>
            <div className="space-y-4">
                {invoices.length > 0 ? invoices.map((inv, i) => (
                    <div key={inv._id || i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white/5 rounded-xl">
                                <FileText size={18} className="text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-white uppercase tracking-tighter">INV-00{i+1}</p>
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Due: {new Date(inv.dueDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-white tracking-tighter">${inv.amount.toLocaleString()}</p>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${inv.status === 'Paid' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {inv.status}
                            </span>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10 flex flex-col items-center">
                        <Clock className="text-slate-700 w-12 h-12 mb-4" />
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">No invoices found.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPortalDashboard;
