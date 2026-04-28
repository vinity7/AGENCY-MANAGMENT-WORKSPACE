import React, { useState, useEffect } from 'react';
import { Gauge, AlertTriangle, CheckCircle2, MoreHorizontal, Loader2, Plus } from 'lucide-react';
import api from '../../api/axios';

const SprintPlanningWorkspace = () => {
  const [sprints, setSprints] = useState([]);
  const [backlog, setBacklog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSprint, setCurrentSprint] = useState(null);

  const fetchData = async () => {
    try {
      const [sprintRes, taskRes] = await Promise.all([
        api.get('/v1/sprints'),
        api.get('/tasks')
      ]);
      
      const allSprints = sprintRes.data;
      setSprints(allSprints);
      
      // Find the most recent sprint in planning or active status
      const planningSprint = allSprints.find(s => s.status === 'planning') || allSprints[0];
      setCurrentSprint(planningSprint);

      // Backlog is tasks not in any sprint (simplified check)
      const inSprintIds = new Set();
      allSprints.forEach(s => s.items.forEach(item => inSprintIds.add(item.taskId?._id)));
      
      const readyBacklog = taskRes.data.filter(t => !inSprintIds.has(t._id) && t.status !== 'Completed');
      setBacklog(readyBacklog);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching sprint data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddToSprint = async (taskId) => {
    if (!currentSprint) return;
    try {
      await api.post(`/v1/sprints/${currentSprint._id}/add-items`, {
        taskIds: [{ taskId, estimate: 5 }] // Default estimate for now
      });
      fetchData();
    } catch (err) {
      console.error('Add to sprint error:', err);
    }
  };

  const planned = currentSprint?.items?.reduce((sum, item) => sum + (item.estimate || 0), 0) || 0;
  const capacity = currentSprint?.capacity || 40;
  const isOverCapacity = planned > capacity;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <Loader2 size={32} className="text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left: Planning Area */}
      <div className="lg:col-span-8 space-y-8">
        {currentSprint ? (
          <>
            <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                  {currentSprint.name} - {currentSprint.status.toUpperCase()}
                </h3>
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sprint Goal:</span>
                  <span className="text-sm font-bold text-white italic">"{currentSprint.goal}"</span>
                </div>
              </div>

              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`absolute top-0 left-0 h-full transition-all duration-1000 ${isOverCapacity ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]' : 'bg-blue-500 shadow-[0_0_15px_#3b82f6]'}`}
                  style={{ width: `${Math.min((planned/capacity)*100, 100)}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Team Capacity</span>
                   <div className="text-3xl font-black text-white">{capacity}<span className="text-sm text-slate-600 ml-1">pts</span></div>
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Planned Load</span>
                   <div className={`text-3xl font-black ${isOverCapacity ? 'text-rose-500' : 'text-blue-500'}`}>{planned}<span className="text-sm opacity-50 ml-1">pts</span></div>
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Remaining</span>
                   <div className="text-3xl font-black text-slate-400">{Math.max(capacity - planned, 0)}<span className="text-sm text-slate-600 ml-1">pts</span></div>
                </div>
              </div>
            </div>

            <div className="bg-[#111111] border border-white/5 rounded-3xl overflow-hidden">
               <div className="p-6 border-b border-white/5">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sprint Backlog Items</h4>
               </div>
               <div className="divide-y divide-white/5">
                  {currentSprint.items.length === 0 ? (
                    <div className="p-10 text-center text-slate-600 text-xs font-bold uppercase tracking-widest">No items added to this sprint yet.</div>
                  ) : (
                    currentSprint.items.map((item, i) => (
                      <div key={item._id || i} className="p-6 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                          <div className="flex items-center space-x-4">
                            <CheckCircle2 size={18} className="text-blue-500/30 group-hover:text-blue-500 transition-all" />
                            <div>
                                <p className="text-sm font-bold text-white uppercase tracking-tight">{item.taskId?.name || 'Unknown Task'}</p>
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Est: {item.estimate} pts</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {item.atRisk && (
                                <div className="flex items-center space-x-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-500 text-[8px] font-black uppercase tracking-widest">
                                  <AlertTriangle size={10} />
                                  <span>At Risk</span>
                                </div>
                            )}
                            <button className="text-slate-600 hover:text-white transition-colors">
                                <MoreHorizontal size={18} />
                            </button>
                          </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
          </>
        ) : (
          <div className="bg-[#111111] border border-white/5 rounded-3xl p-20 text-center">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active or planning sprints found.</p>
              <button className="mt-6 premium-gradient px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">
                Create First Sprint
              </button>
          </div>
        )}
      </div>

      {/* Right: Backlog Selection */}
      <div className="lg:col-span-4 space-y-6">
         <div className="bg-[#111111] border border-white/5 rounded-3xl p-6">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4 text-center">Ready Backlog (Click to Plan)</h4>
            <div className="space-y-3">
               {backlog.length === 0 ? (
                 <p className="text-center text-slate-700 text-[10px] font-black uppercase py-4">Backlog is empty</p>
               ) : (
                 backlog.map(task => (
                    <div key={task._id} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-blue-500/50 transition-all group relative">
                        <p className="text-xs font-bold text-white uppercase tracking-tighter pr-8">{task.name}</p>
                        <div className="flex justify-between items-center mt-3">
                           <span className="text-[10px] font-black text-slate-600 italic">Est: 5 pts</span>
                           <button 
                             onClick={() => handleAddToSprint(task._id)}
                             className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                              <Plus size={16} />
                           </button>
                        </div>
                    </div>
                 ))
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default SprintPlanningWorkspace;

