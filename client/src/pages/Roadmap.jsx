import React, { useState, useEffect } from 'react';
import RoadmapTimeline from './scrum/RoadmapTimeline';
import InitiativeCard from './scrum/InitiativeCard';
import api from '../api/axios';
import { Loader2, Plus } from 'lucide-react';

const Roadmap = () => {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newInitiative, setNewInitiative] = useState({
    title: '',
    description: '',
    businessValue: 'Medium',
    targetQuarter: 'Q2 2025'
  });

  const fetchInitiatives = async () => {
    try {
      const res = await api.get('/v1/roadmap/initiatives');
      setInitiatives(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching initiatives:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitiatives();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/v1/roadmap/initiatives', newInitiative);
      setShowCreateModal(false);
      setNewInitiative({ title: '', description: '', businessValue: 'Medium', targetQuarter: 'Q2 2025' });
      fetchInitiatives();
    } catch (err) {
      console.error('Create initiative error:', err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 size={32} className="text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Strategic <span className="text-blue-500">Roadmap</span></h1>
          <p className="text-slate-400 font-medium mt-1">PM-driven strategy translation to product backlog.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="premium-gradient px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 hover:scale-105 transition-all flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>New Initiative</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
           <RoadmapTimeline initiatives={initiatives} />
        </div>
        <div className="lg:col-span-4 space-y-6">
           <h3 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4">Key Initiatives</h3>
           <div className="space-y-4">
              {initiatives.length === 0 ? (
                <p className="text-slate-500 text-xs italic font-bold uppercase tracking-widest text-center py-8">No initiatives defined yet.</p>
              ) : (
                initiatives.map(initiative => (
                  <InitiativeCard 
                    key={initiative._id}
                    initiative={initiative}
                    onUpdate={fetchInitiatives}
                  />
                ))
              )}
           </div>
        </div>
      </div>

      {/* Create Initiative Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl w-full max-w-md p-8 relative shadow-2xl">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white">
                <Plus size={20} className="rotate-45" />
            </button>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6">Create <span className="text-blue-500">Initiative</span></h2>
            <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Title</label>
                    <input 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50"
                        value={newInitiative.title}
                        onChange={e => setNewInitiative({...newInitiative, title: e.target.value})}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</label>
                    <textarea 
                        required
                        rows="3"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50"
                        value={newInitiative.description}
                        onChange={e => setNewInitiative({...newInitiative, description: e.target.value})}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Value</label>
                        <select 
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50 appearance-none"
                            value={newInitiative.businessValue}
                            onChange={e => setNewInitiative({...newInitiative, businessValue: e.target.value})}
                        >
                            <option value="Low" className="bg-[#0f0f0f]">Low</option>
                            <option value="Medium" className="bg-[#0f0f0f]">Medium</option>
                            <option value="High" className="bg-[#0f0f0f]">High</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quarter</label>
                        <input 
                            required
                            placeholder="Q2 2025"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50"
                            value={newInitiative.targetQuarter}
                            onChange={e => setNewInitiative({...newInitiative, targetQuarter: e.target.value})}
                        />
                    </div>
                </div>
                <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 transition-all">
                    Initialize Strategy
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;

