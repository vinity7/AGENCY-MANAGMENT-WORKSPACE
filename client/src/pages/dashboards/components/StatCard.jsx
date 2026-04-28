import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, trend, color, loading }) => {
  if (loading) {
    return (
      <div className="bg-[#111111] border border-white/5 p-6 rounded-3xl animate-pulse">
        <div className="h-3 w-20 bg-white/5 rounded mb-4"></div>
        <div className="h-8 w-24 bg-white/10 rounded"></div>
      </div>
    );
  }

  const getTrendIcon = (t) => {
    if (t?.startsWith('+')) return <TrendingUp size={12} className="text-emerald-500" />;
    if (t?.startsWith('-')) return <TrendingDown size={12} className="text-rose-500" />;
    return <Minus size={12} className="text-slate-500" />;
  };

  const getCardColor = () => {
    switch (color) {
      case 'blue': return 'from-blue-600/20 to-transparent border-blue-500/10';
      case 'purple': return 'from-purple-600/20 to-transparent border-purple-500/10';
      case 'emerald': return 'from-emerald-600/20 to-transparent border-emerald-500/10';
      case 'rose': return 'from-rose-600/20 to-transparent border-rose-500/10';
      case 'amber': return 'from-amber-600/20 to-transparent border-amber-500/10';
      default: return 'from-slate-600/20 to-transparent border-white/5';
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getCardColor()} border p-6 rounded-3xl transition-transform hover:scale-[1.02] duration-300`}>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-black text-white">{value}</h3>
        <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/5">
          {getTrendIcon(trend)}
          <span className="text-[10px] font-bold text-slate-400">{trend}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
