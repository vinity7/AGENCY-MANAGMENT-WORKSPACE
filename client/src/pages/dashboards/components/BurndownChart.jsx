import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const BurndownChart = ({ data }) => {
  return (
    <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 h-[350px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sprint Burndown (Ideal vs Actual)</h4>
        <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest font-mono">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            <span className="text-slate-300">Actual</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full border border-slate-500"></div>
            <span className="text-slate-500">Ideal</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 9, fontWeight: 700 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 9, fontWeight: 700 }}
              label={{ value: 'Points', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 9, fontWeight: 700, offset: 10 }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0b0b0b', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
              itemStyle={{ fontWeight: 700, textTransform: 'uppercase' }}
            />
            <Area 
              type="monotone" 
              dataKey="actual" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorActual)" 
              animationDuration={2000} 
              connectNulls={true}
            />
            <Line 
              type="monotone" 
              dataKey="ideal" 
              stroke="#64748b" 
              strokeWidth={1} 
              strokeDasharray="5 5" 
              dot={false} 
              activeDot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BurndownChart;
