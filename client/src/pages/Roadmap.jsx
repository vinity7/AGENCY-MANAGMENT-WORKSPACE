import React, { useState, useEffect } from 'react';
import RoadmapTimeline from './scrum/RoadmapTimeline';
import InitiativeCard from './scrum/InitiativeCard';

const Roadmap = () => {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initiatives from API
    // fetch('/api/v1/roadmap/initiatives')
    setLoading(false);
  }, []);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Strategic <span className="text-blue-500">Roadmap</span></h1>
          <p className="text-slate-400 font-medium mt-1">PM-driven strategy translation to product backlog.</p>
        </div>
        <button className="premium-gradient px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">
          New Initiative
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
           <RoadmapTimeline initiatives={initiatives} />
        </div>
        <div className="lg:col-span-4 space-y-6">
           <h3 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4">Key Initiatives</h3>
           <div className="space-y-4">
              {/* Mapping mock/real initiatives */}
              <InitiativeCard 
                title="Q2 Global Expansion" 
                quarter="Q2 2025" 
                value="High" 
                status="active" 
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
