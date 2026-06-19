import React, { useState, useEffect } from 'react';
import { Gauge, AlertTriangle, CheckCircle2, MoreHorizontal, Loader2, Plus, Trash2, Calendar, Play, Check, X, Info } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

// Sub-component for individual backlog items to isolate local state for input performance
const BacklogItem = ({ task, onAddToSprint, onUpdateRice, disabled }) => {
  const [reach, setReach] = useState(task.reach || 0);
  const [impact, setImpact] = useState(task.impact || 1);
  const [confidence, setConfidence] = useState(task.confidence !== undefined ? task.confidence : 100);
  const [effort, setEffort] = useState(task.effort || 1);

  useEffect(() => {
    setReach(task.reach || 0);
    setImpact(task.impact || 1);
    setConfidence(task.confidence !== undefined ? task.confidence : 100);
    setEffort(task.effort || 1);
  }, [task]);

  const computedRice = (Number(reach) * Number(impact) * (Number(confidence) / 100)) / (Number(effort) || 1);

  const triggerSave = () => {
    const r = Math.max(0, Number(reach) || 0);
    const i = Math.max(0, Number(impact) || 0);
    const c = Math.max(0, Math.min(100, Number(confidence) || 0));
    const e = Math.max(1, Number(effort) || 1);

    if (r !== task.reach || i !== task.impact || c !== task.confidence || e !== task.effort) {
      onUpdateRice(task._id, { reach: r, impact: i, confidence: c, effort: e });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-blue-500/50 transition-all group relative space-y-3">
      <div className="flex justify-between items-start">
        <p className="text-xs font-bold text-white uppercase tracking-tighter pr-8">{task.name}</p>
        {!disabled && (
          <button 
            onClick={() => onAddToSprint(task)}
            className="text-blue-500 hover:text-white transition-all p-1 bg-blue-500/10 hover:bg-blue-500 rounded-lg"
            title="Add to Planned Sprint"
          >
            <Plus size={14} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div>
          <span className="text-[8px] font-black text-slate-500 block mb-1">REACH</span>
          <input 
            type="number" 
            disabled={disabled}
            value={reach} 
            onChange={e => setReach(e.target.value)} 
            onBlur={triggerSave}
            onKeyDown={handleKeyDown}
            className="w-full bg-black border border-white/10 rounded px-1 py-0.5 text-[10px] text-white outline-none focus:border-blue-500 transition-colors disabled:opacity-40"
          />
        </div>
        <div>
          <span className="text-[8px] font-black text-slate-500 block mb-1">IMPACT</span>
          <input 
            type="number" 
            step="0.1"
            disabled={disabled}
            value={impact} 
            onChange={e => setImpact(e.target.value)} 
            onBlur={triggerSave}
            onKeyDown={handleKeyDown}
            className="w-full bg-black border border-white/10 rounded px-1 py-0.5 text-[10px] text-white outline-none focus:border-blue-500 transition-colors disabled:opacity-40"
          />
        </div>
        <div>
          <span className="text-[8px] font-black text-slate-500 block mb-1">CONF %</span>
          <input 
            type="number" 
            disabled={disabled}
            value={confidence} 
            onChange={e => setConfidence(e.target.value)} 
            onBlur={triggerSave}
            onKeyDown={handleKeyDown}
            className="w-full bg-black border border-white/10 rounded px-1 py-0.5 text-[10px] text-white outline-none focus:border-blue-500 transition-colors disabled:opacity-40"
          />
        </div>
        <div>
          <span className="text-[8px] font-black text-slate-500 block mb-1">EFFORT</span>
          <input 
            type="number" 
            disabled={disabled}
            value={effort} 
            onChange={e => setEffort(e.target.value)} 
            onBlur={triggerSave}
            onKeyDown={handleKeyDown}
            className="w-full bg-black border border-white/10 rounded px-1 py-0.5 text-[10px] text-white outline-none focus:border-blue-500 transition-colors disabled:opacity-40"
          />
        </div>
      </div>

      <div className="flex justify-between items-center text-[9px] pt-1.5 border-t border-white/5 font-sans font-bold">
        <span className="text-slate-500 uppercase tracking-wider">{task.project?.name || 'Project'}</span>
        <span className="text-blue-400 uppercase tracking-wider">RICE: {computedRice.toFixed(1)}</span>
      </div>
    </div>
  );
};

const SprintPlanningWorkspace = () => {
  const [sprints, setSprints] = useState([]);
  const [backlog, setBacklog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSprint, setActiveSprint] = useState(null);

  // Planning Session state (client-side draft)
  const [isPlanning, setIsPlanning] = useState(false);
  const [plannedItems, setPlannedItems] = useState([]);
  const [capacity, setCapacity] = useState(40);
  const [sprintName, setSprintName] = useState('');
  const [sprintGoal, setSprintGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Modals
  const [showLaunchModal, setShowLaunchModal] = useState(false);

  const fetchData = async () => {
    try {
      const [sprintRes, taskRes] = await Promise.all([
        api.get('/v1/sprints'),
        api.get('/tasks')
      ]);
      
      const allSprints = sprintRes.data;
      setSprints(allSprints);
      
      // Look for current active sprint
      const currentActive = allSprints.find(s => s.status === 'active');
      setActiveSprint(currentActive || null);

      if (currentActive) {
        setIsPlanning(false);
      }

      // Backlog contains tasks with refinementState === 'Ready for Development' and not finished/completed
      // And not part of the active sprint items
      const inSprintIds = new Set();
      if (currentActive) {
        currentActive.items.forEach(item => {
          if (item.taskId?._id) inSprintIds.add(item.taskId._id);
        });
      }

      const readyBacklog = taskRes.data.filter(t => 
        !inSprintIds.has(t._id) && 
        t.status !== 'Completed' && 
        t.refinementState === 'Ready for Development'
      );
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

  const handleUpdateRice = async (taskId, riceData) => {
    try {
      const res = await api.put(`/v1/tasks/${taskId}/rice`, riceData);
      // Update local tasks
      setBacklog(prev => prev.map(t => t._id === taskId ? { ...t, ...res.data } : t));
    } catch (err) {
      console.error('Update RICE error:', err);
    }
  };

  const handleAddToPlanned = (task) => {
    if (plannedItems.some(item => item.taskId === task._id)) return;
    setPlannedItems(prev => [...prev, { taskId: task._id, name: task.name, estimate: 5 }]);
    // Remove from temporary backlog list view
    setBacklog(prev => prev.filter(t => t._id !== task._id));
  };

  const handleRemoveFromPlanned = (taskId) => {
    const item = plannedItems.find(i => i.taskId === taskId);
    if (!item) return;
    setPlannedItems(prev => prev.filter(i => i.taskId !== taskId));
    // Fetch again or restore to backlog list
    fetchData();
  };

  const handleUpdatePlannedEstimate = (taskId, newEstimate) => {
    setPlannedItems(prev => prev.map(item => 
      item.taskId === taskId ? { ...item, estimate: Math.max(0, Number(newEstimate) || 0) } : item
    ));
  };

  const handleStartPlanning = () => {
    setIsPlanning(true);
    setPlannedItems([]);
    setSprintName(`Sprint ${sprints.length + 1}`);
    setSprintGoal('');
    setCapacity(40);
    // Set default dates: today to 2 weeks from now
    const today = new Date();
    const twoWeeks = new Date();
    twoWeeks.setDate(today.getDate() + 14);
    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(twoWeeks.toISOString().split('T')[0]);
  };

  const handleCancelPlanning = () => {
    setIsPlanning(false);
    setPlannedItems([]);
    fetchData();
  };

  const handleLaunchSprint = async (e) => {
    e.preventDefault();
    if (plannedItems.length === 0) {
      alert('Please add at least one task to the sprint backlog before launching.');
      return;
    }
    
    try {
      const sprintPayload = {
        name: sprintName,
        goal: sprintGoal,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        capacity: Number(capacity) || 40,
        status: 'active',
        items: plannedItems.map(item => ({
          taskId: item.taskId,
          estimate: item.estimate
        }))
      };

      await api.post('/v1/sprints', sprintPayload);
      setShowLaunchModal(false);
      setIsPlanning(false);
      setPlannedItems([]);
      fetchData();
      console.log('Sprint successfully initialized and launched.');
    } catch (err) {
      console.error('Launch sprint error:', err);
      alert(err.response?.data?.msg || 'Failed to launch sprint');
    }
  };

  const handleCompleteSprint = async () => {
    if (!activeSprint) return;
    if (!window.confirm('Are you sure you want to complete this sprint? All tasks will be finalized.')) return;
    try {
      await api.patch(`/v1/sprints/${activeSprint._id}`, { status: 'completed' });
      fetchData();
    } catch (err) {
      console.error('Complete sprint error:', err);
    }
  };

  // Calculations
  const plannedLoad = isPlanning 
    ? plannedItems.reduce((sum, item) => sum + (item.estimate || 0), 0)
    : activeSprint?.items?.reduce((sum, item) => sum + (item.estimate || 0), 0) || 0;

  const currentCapacity = isPlanning ? capacity : activeSprint?.capacity || 40;
  const isOverCapacity = plannedLoad > currentCapacity;

  // Sorting backlog by descending computed RICE score
  const getRiceScore = (t) => {
    const r = t.reach || 0;
    const i = t.impact || 0;
    const c = t.confidence !== undefined ? t.confidence : 100;
    const e = t.effort || 1;
    return (r * i * (c / 100)) / e;
  };

  const sortedBacklog = [...backlog].sort((a, b) => getRiceScore(b) - getRiceScore(a));

  if (loading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <Loader2 size={32} className="text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Top Banner Warning */}
      {isOverCapacity && (
        <div className="flex items-center space-x-3 bg-rose-500/10 border border-rose-500/20 rounded-3xl p-5 text-rose-400 animate-in fade-in duration-300">
          <AlertTriangle size={20} className="flex-shrink-0 animate-pulse text-rose-500" />
          <div className="text-xs font-bold uppercase tracking-wider leading-relaxed">
            Warning: The planned load ({plannedLoad} pts) exceeds your team's sprint capacity limit ({currentCapacity} pts). Consider scaling back or seeking PO overrides before launching.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Planning Area */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Active Sprint Overview */}
          {activeSprint && (
            <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 space-y-8 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center space-x-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Sprint</span>
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mt-1">{activeSprint.name}</h3>
                </div>
                <div className="flex items-center space-x-4 bg-white/5 border border-white/5 px-4 py-2 rounded-2xl">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Goal:</span>
                  <span className="text-xs font-bold text-white italic">"{activeSprint.goal}"</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Planned Load Status</span>
                  <span>{plannedLoad} / {currentCapacity} pts</span>
                </div>
                <div className="relative h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full transition-all duration-1000 ${isOverCapacity ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]' : 'bg-blue-500 shadow-[0_0_15px_#3b82f6]'}`}
                    style={{ width: `${Math.min((plannedLoad/currentCapacity)*100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Team Capacity</span>
                   <div className="text-2xl font-black text-white">{currentCapacity}<span className="text-xs text-slate-600 ml-1">pts</span></div>
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Current Load</span>
                   <div className={`text-2xl font-black ${isOverCapacity ? 'text-rose-500' : 'text-blue-500'}`}>{plannedLoad}<span className="text-xs opacity-50 ml-1">pts</span></div>
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Remaining Margin</span>
                   <div className="text-2xl font-black text-slate-400">{Math.max(currentCapacity - plannedLoad, 0)}<span className="text-xs text-slate-600 ml-1">pts</span></div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <Calendar size={12} className="text-blue-500" />
                  <span>Timeline: {new Date(activeSprint.startDate).toLocaleDateString()} - {new Date(activeSprint.endDate).toLocaleDateString()}</span>
                </div>
                <button
                  onClick={handleCompleteSprint}
                  className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-wider transition-all"
                >
                  Complete Active Sprint
                </button>
              </div>
            </div>
          )}

          {/* Active Sprint Items List */}
          {activeSprint && (
            <div className="bg-[#111111] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
               <div className="p-6 border-b border-white/5">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Sprint backlog</h4>
               </div>
               <div className="divide-y divide-white/5">
                  {activeSprint.items.length === 0 ? (
                    <div className="p-10 text-center text-slate-600 text-xs font-bold uppercase tracking-widest">No tasks added to this sprint.</div>
                  ) : (
                    activeSprint.items.map((item, i) => (
                      <div key={item._id || i} className="p-6 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                          <div className="flex items-center space-x-4">
                            <CheckCircle2 size={18} className="text-blue-500" />
                            <div>
                                <p className="text-sm font-bold text-white uppercase tracking-tight">{item.taskId?.name || 'Unknown Task'}</p>
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Estimation: {item.estimate} pts</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {item.atRisk && (
                                <div className="flex items-center space-x-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-500 text-[8px] font-black uppercase tracking-widest">
                                  <AlertTriangle size={10} />
                                  <span>At Risk</span>
                                </div>
                            )}
                          </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
          )}

          {/* Draft Sprint Planning Board */}
          {isPlanning && (
            <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 space-y-8 shadow-xl relative">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Planning Session</span>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Draft Sprint Configuration</h3>
                </div>
                <button
                  onClick={handleCancelPlanning}
                  className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Configure Details Inline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider pl-1">Sprint Name</label>
                  <input
                    type="text"
                    required
                    value={sprintName}
                    onChange={e => setSprintName(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 outline-none transition-colors"
                    placeholder="Sprint Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider pl-1">Sprint Capacity (Story Points)</label>
                  <input
                    type="number"
                    required
                    value={capacity}
                    onChange={e => setCapacity(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 outline-none transition-colors"
                    placeholder="e.g. 40"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider pl-1">Sprint Goal</label>
                  <input
                    type="text"
                    required
                    value={sprintGoal}
                    onChange={e => setSprintGoal(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 outline-none transition-colors"
                    placeholder="Define the primary deliverable of this sprint..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider pl-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider pl-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Progress metrics */}
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Planned Sprint Load</span>
                  <span>{plannedLoad} / {capacity} pts</span>
                </div>
                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full transition-all duration-1000 ${isOverCapacity ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]' : 'bg-blue-500 shadow-[0_0_15px_#3b82f6]'}`}
                    style={{ width: `${Math.min((plannedLoad/capacity)*100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Planned Items list */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Planned Sprint Backlog ({plannedItems.length})</h4>
                <div className="divide-y divide-white/5 bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden">
                  {plannedItems.length === 0 ? (
                    <div className="p-8 text-center text-slate-600 text-xs font-bold uppercase tracking-widest">
                      Drag or select tasks from the backlog panel on the right.
                    </div>
                  ) : (
                    plannedItems.map(item => (
                      <div key={item.taskId} className="p-4 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                        <div>
                          <p className="text-xs font-bold text-white uppercase tracking-tight">{item.name}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Est (pts):</span>
                            <input
                              type="number"
                              value={item.estimate}
                              onChange={e => handleUpdatePlannedEstimate(item.taskId, e.target.value)}
                              className="w-12 bg-black border border-white/10 rounded px-1.5 py-0.5 text-xs text-white text-center outline-none focus:border-blue-500"
                            />
                          </div>
                          <button
                            onClick={() => handleRemoveFromPlanned(item.taskId)}
                            className="p-1 text-slate-500 hover:text-rose-500 transition-colors"
                            title="Remove from planned list"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-white/5">
                <button
                  onClick={handleCancelPlanning}
                  className="px-6 py-3 rounded-xl border border-white/5 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowLaunchModal(true)}
                  className="premium-gradient px-8 py-3 rounded-xl text-white font-black text-xs uppercase tracking-widest flex items-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20"
                >
                  <Play size={12} fill="white" />
                  <span>Launch Sprint</span>
                </button>
              </div>
            </div>
          )}

          {/* Idle screen with option to plan */}
          {!activeSprint && !isPlanning && (
            <div className="bg-[#111111] border border-white/5 rounded-3xl p-16 text-center space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.03),transparent)] pointer-events-none"></div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto text-blue-500">
                <Gauge size={24} />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">No active sprints currently running</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Use the planning workspace to construct a target backlog load, evaluate team capacity, verify refinement scopes, and execute launches.
                </p>
              </div>
              <button 
                onClick={handleStartPlanning}
                className="premium-gradient px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 mx-auto"
              >
                <Plus size={14} />
                <span>Initialize Sprint planning</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Backlog Selection */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 shadow-xl relative">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 border-b border-white/5 pb-4 text-center">
              Ready Backlog ({sortedBacklog.length})
            </h4>
            
            {activeSprint && (
              <div className="flex items-center space-x-2 bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-snug mb-4">
                <Info size={14} className="text-blue-500 flex-shrink-0" />
                <span>An active sprint is currently running. Backlog planning changes are locked.</span>
              </div>
            )}
            
            <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-1">
              {sortedBacklog.length === 0 ? (
                <p className="text-center text-slate-700 text-[10px] font-black uppercase py-8 tracking-widest">
                  No items ready for planning
                </p>
              ) : (
                sortedBacklog.map(task => (
                  <BacklogItem 
                    key={task._id} 
                    task={task} 
                    onAddToSprint={handleAddToPlanned}
                    onUpdateRice={handleUpdateRice}
                    disabled={activeSprint !== null || !isPlanning}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Launch Modal */}
      <Modal
        isOpen={showLaunchModal}
        onClose={() => setShowLaunchModal(false)}
        title="Confirm Sprint Launch"
      >
        <form onSubmit={handleLaunchSprint} className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              You are about to launch <strong className="text-white">"{sprintName}"</strong> into active execution with <strong className="text-white">{plannedItems.length}</strong> tasks and a planned capacity load of <strong className="text-white">{plannedLoad} story points</strong>.
            </p>
          </div>

          {isOverCapacity && (
            <div className="flex items-start space-x-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-rose-400">
              <AlertTriangle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
              <div className="text-[10px] font-bold uppercase tracking-wider leading-normal">
                WARNING: The team capacity boundary is exceeded. Proceeding will trigger alerts across execution boards.
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowLaunchModal(false)}
              className="flex-1 py-3 rounded-xl border border-white/5 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Adjust Load
            </button>
            <button
              type="submit"
              className="flex-1 py-3 premium-gradient rounded-xl text-white font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2"
            >
              <Check size={14} />
              <span>Confirm & Launch</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SprintPlanningWorkspace;
