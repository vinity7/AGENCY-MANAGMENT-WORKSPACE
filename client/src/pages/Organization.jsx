import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  Building, 
  Users, 
  CreditCard, 
  Shield, 
  CheckCircle,
  Gem,
  Zap,
  Star,
  Activity
} from 'lucide-react';
import TeamManagement from './Organization/TeamManagement';

const Organization = () => {
  const { token, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [orgData, setOrgData] = useState(null);
  const [userCount, setUserCount] = useState(0);

  const config = {
    headers: { 'x-auth-token': token },
  };

  const fetchOrgOverview = async () => {
    try {
      // Fetching team count for overview stats
      const res = await axios.get('/api/v1/organizations/team', config);
      setUserCount(res.data.length);
      
      setOrgData({
        name: 'AgencyOS Legacy',
        tier: user.tier || 'Free',
        owner: user.name
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgOverview();
  }, []);

  const tiers = [
    { 
      name: 'Free', 
      icon: <Zap size={20} />, 
      price: '$0', 
      features: ['20 Team Members', 'Basic Tracking', 'Email Support'],
      active: true // Forcing active for demo
    },
    { 
      name: 'Pro', 
      icon: <Gem size={20} />, 
      price: '$49', 
      features: ['Unlimited Projects', 'Automated Invoicing', 'RICE Scoring', 'Team Insights'],
      active: false
    },
    { 
      name: 'Enterprise', 
      icon: <Star size={20} />, 
      price: '$199', 
      features: ['AI Predictive Analytics', 'Capacity Planning', 'Client Portal', 'Custom Branding'],
      active: false
    }
  ];

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Organization Settings</h1>
          <p className="text-slate-400">Manage your workspace, team, and roles.</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/5 p-1 rounded-2xl w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: <Building size={16} /> },
          { id: 'team', label: 'Team Management', icon: <Users size={16} /> },
          { id: 'billing', label: 'Subscription', icon: <CreditCard size={16} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Section */}
        <div className="lg:col-span-3">
          
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 space-y-6">
                <h3 className="text-xl font-bold flex items-center space-x-2">
                  <Shield size={20} className="text-blue-500" />
                  <span>Workspace Intelligence</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 p-6 rounded-2xl space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Organization Name</p>
                    <p className="text-white font-bold text-lg">{orgData?.name}</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Tier</p>
                    <div className="flex items-center space-x-2">
                       <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black px-2 py-0.5 rounded uppercase border border-blue-500/30">
                        {orgData?.tier}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Team Capacity</p>
                    <p className="text-white font-bold text-lg">{userCount} / 20 Users</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/10 rounded-3xl p-8 flex items-center justify-between">
                <div className="space-y-2">
                   <h4 className="text-lg font-bold">Migration Verified</h4>
                   <p className="text-slate-400 text-sm max-w-md">Your workspace has been successfully migrated to the new Role Management System (v2).</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/50">
                   <CheckCircle size={24} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <TeamManagement token={token} />
          )}

          {activeTab === 'billing' && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold">Scaling Your Agency</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tiers.map((tier) => (
                  <div 
                    key={tier.name}
                    className={`relative p-8 rounded-3xl border transition-all duration-500 overflow-hidden group ${
                      tier.active 
                        ? 'bg-blue-600/10 border-blue-500/50 shadow-2xl shadow-blue-500/10 scale-[1.02]' 
                        : 'bg-[#111111] border-white/5 hover:border-white/20'
                    }`}
                  >
                    {tier.active && (
                       <div className="absolute top-0 right-0 bg-blue-500 text-[10px] font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-widest">
                        Current
                       </div>
                    )}
                    <div className={`p-4 rounded-2xl w-fit mb-6 transition-transform duration-500 group-hover:scale-110 ${
                      tier.active ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400'
                    }`}>
                      {tier.icon}
                    </div>
                    <h4 className="text-2xl font-black text-white mb-1 tracking-tight">{tier.name}</h4>
                    <p className="text-3xl font-black text-blue-500 mb-6">{tier.price}<span className="text-sm text-slate-500 font-bold">/mo</span></p>
                    
                    <ul className="space-y-4 mb-8">
                      {tier.features.map(f => (
                        <li key={f} className="flex items-center space-x-2 text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
                          <CheckCircle size={12} className="text-blue-500" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {!tier.active && (
                      <button className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-all">
                        Upgrade
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar Mini Profile */}
        <div className="space-y-6">
          <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <div className="relative h-24 w-24 rounded-3xl premium-gradient flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-blue-500/20">
                {user.name.charAt(0)}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-black">{user.name}</h4>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{user.role?.replace('_', ' ')}</p>
            </div>
          </div>

          <div className="bg-blue-600/5 border border-blue-500/10 rounded-3xl p-6 space-y-4">
            <h5 className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Resource Usage</h5>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold">Seat Utilization</span>
                <span className="text-white font-black">{userCount} / 20</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-1000" 
                  style={{ width: `${(userCount / 20) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-[#111111] border border-white/5 rounded-3xl space-y-4">
             <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Permissions</h5>
             <div className="flex flex-wrap gap-2">
                {['Direct Creation', 'RBAC Control', 'Org Settings'].map(p => (
                  <span key={p} className="text-[9px] font-bold bg-white/5 text-slate-400 px-2 py-1 rounded border border-white/5">
                    {p}
                  </span>
                ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Organization;
