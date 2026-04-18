import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Smile, TrendingUp } from 'lucide-react';

const HappinessMeter = ({ score, trend }) => {
  const getEmoji = (s) => {
    if (s >= 4.5) return '🤩';
    if (s >= 4.0) return '😊';
    if (s >= 3.0) return '😐';
    if (s >= 2.0) return '😟';
    return '😫';
  };

  const getStatusText = (s) => {
    if (s >= 4.5) return 'Exhilarated';
    if (s >= 4.0) return 'Strong Morale';
    if (s >= 3.0) return 'Steady';
    if (s >= 2.0) return 'Disengaged';
    return 'Burnout Risk';
  };

  const currentScore = score || 0;

  return (
    <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-between h-full group hover:border-emerald-500/20 transition-all duration-500">
      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest self-start mb-4">Team Happiness Meter</h4>
      
      <div className="relative flex flex-col items-center py-4">
        <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-500">
          {getEmoji(currentScore)}
        </div>
        <div className="text-center">
          <p className="text-3xl font-black text-white tracking-tighter">{currentScore.toFixed(1)} <span className="text-sm text-slate-500">/ 5.0</span></p>
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mt-2">{getStatusText(currentScore)}</p>
        </div>
      </div>

      <div className="w-full mt-6 flex flex-col space-y-3">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <TrendingUp size={12} className="text-emerald-500" />
            <span>Weekly Trend</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-500">+2%</span>
        </div>
        
        <div className="h-16 w-full opacity-50 group-hover:opacity-100 transition-opacity duration-500">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#10b981" 
                strokeWidth={2} 
                fill="#10b98120" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <button className="w-full mt-6 py-3 bg-white/5 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5 hover:border-emerald-500/20">
        Record Pulse Check
      </button>
    </div>
  );
};

export default HappinessMeter;
