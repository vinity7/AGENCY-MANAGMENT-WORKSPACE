import React from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0b0b0b] border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
        <p className="text-sm font-black text-white mb-2">{data.name}</p>
        <div className="space-y-1">
          <div className="flex justify-between items-center space-x-6">
            <span className="text-[10px] font-black text-slate-500 uppercase">Impact:</span>
            <span className="text-xs font-black text-blue-400">{data.x}</span>
          </div>
          <div className="flex justify-between items-center space-x-6">
            <span className="text-[10px] font-black text-slate-500 uppercase">Effort:</span>
            <span className="text-xs font-black text-rose-400">{data.y}</span>
          </div>
          <div className="flex justify-between items-center space-x-6 border-t border-white/5 pt-2 mt-2">
            <span className="text-[10px] font-black text-slate-500 uppercase">Confidence:</span>
            <span className="text-xs font-black text-emerald-400">{data.confidence}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const PriorityChart = ({ data, title }) => {
  return (
    <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 h-[400px] flex flex-col relative overflow-hidden">
      {/* Quadrant Labels */}
      <div className="absolute top-8 right-8 text-[8px] font-black text-emerald-500/30 uppercase tracking-[0.2em]">High Impact / Low Effort (Quick Wins)</div>
      <div className="absolute top-8 left-8 text-[8px] font-black text-blue-500/30 uppercase tracking-[0.2em]">Strategic Initiatives</div>
      <div className="absolute bottom-16 right-8 text-[8px] font-black text-rose-500/30 uppercase tracking-[0.2em]">Low Priority</div>
      <div className="absolute bottom-16 left-8 text-[8px] font-black text-amber-500/30 uppercase tracking-[0.2em]">High Maintenance</div>

      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">{title || 'RICE Priority Matrix'}</h4>
      
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="impact" 
              domain={[0, 10]} 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
              label={{ value: 'Impact', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 10, fontWeight: 900, textAnchor: 'middle' }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="effort" 
              domain={[0, 10]} 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
              label={{ value: 'Effort', angle: -90, position: 'insideLeft', offset: 0, fill: '#64748b', fontSize: 10, fontWeight: 900 }}
            />
            <ZAxis type="number" dataKey="z" range={[100, 1000]} name="confidence" />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Features" data={data}>
              {data?.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.x > 5 ? (entry.y < 5 ? '#10b981' : '#3b82f6') : (entry.y < 5 ? '#f59e0b' : '#ef4444')} 
                  fillOpacity={0.6}
                  stroke={entry.x > 5 ? (entry.y < 5 ? '#10b981' : '#3b82f6') : (entry.y < 5 ? '#f59e0b' : '#ef4444')}
                  strokeWidth={2}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriorityChart;
