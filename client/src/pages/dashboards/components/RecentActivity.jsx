import React from 'react';
import { UserPlus, CheckCircle, CreditCard, Layers, Clock } from 'lucide-react';

const RecentActivity = ({ activities }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'client_added': return <UserPlus size={14} className="text-blue-400" />;
      case 'project_completed': return <Layers size={14} className="text-emerald-400" />;
      case 'invoice_paid': return <CreditCard size={14} className="text-amber-400" />;
      case 'task_done': return <CheckCircle size={14} className="text-slate-400" />;
      default: return <Clock size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 h-full flex flex-col">
      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Recent Activity</h4>
      
      <div className="flex-1 space-y-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
        {activities?.map((activity, idx) => (
          <div key={idx} className="flex space-x-4 group">
            <div className="relative mt-1">
              <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                {getIcon(activity.type)}
              </div>
              {idx !== activities.length - 1 && (
                <div className="absolute top-10 left-4 w-[1px] h-10 bg-white/5"></div>
              )}
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-300">
                <span className="text-white font-bold">{activity.user}</span> {activity.action} <span className="text-blue-400 font-bold">{activity.target}</span>
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
        
        {(!activities || activities.length === 0) && (
          <div className="text-center py-10 opacity-30">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No recent data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
