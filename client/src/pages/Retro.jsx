import React, { useState } from 'react';
import RetrospectiveHub from './scrum/RetrospectiveHub';

const Retro = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Retrospective <span className="text-amber-500">Hub</span></h1>
          <p className="text-slate-400 font-medium mt-1">Facilitating continuous improvement and honest feedback.</p>
        </div>
        <button className="bg-amber-600 hover:bg-amber-500 px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-amber-500/20 hover:scale-105 transition-all">
          New Retro Session
        </button>
      </div>

      <div className="w-full">
         <RetrospectiveHub />
      </div>
    </div>
  );
};

export default Retro;
