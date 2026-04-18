import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Send, Settings, UserPlus, Layers } from 'lucide-react';

const QuickActions = ({ actions, color }) => {
  const navigate = useNavigate();

  const getIcon = (label) => {
    const l = label.toLowerCase();
    if (l.includes('create') || l.includes('add')) return <Plus size={16} />;
    if (l.includes('export') || l.includes('download')) return <Download size={16} />;
    if (l.includes('invite')) return <UserPlus size={16} />;
    if (l.includes('report') || l.includes('feedback')) return <Send size={16} />;
    if (l.includes('roadmap') || l.includes('sprint')) return <Layers size={16} />;
    return <Settings size={16} />;
  };

  const getButtonColor = () => {
    switch (color) {
      case 'purple': return 'bg-purple-600 shadow-purple-500/20';
      case 'orange': return 'bg-orange-600 shadow-orange-500/20';
      case 'emerald': return 'bg-emerald-600 shadow-emerald-500/20';
      case 'blue': return 'bg-blue-600 shadow-blue-500/20';
      default: return 'bg-slate-700 shadow-slate-500/20';
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {actions?.map((action, idx) => (
        <button
          key={idx}
          onClick={() => navigate(action.path)}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 ${getButtonColor()}`}
        >
          {getIcon(action.label)}
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
