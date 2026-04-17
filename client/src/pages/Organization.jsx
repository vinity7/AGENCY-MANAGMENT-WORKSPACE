import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  Building, 
  Users, 
  CreditCard, 
  Mail, 
  Plus, 
  Shield, 
  CheckCircle,
  Gem,
  Zap,
  Star,
  Activity
} from 'lucide-react';

const Organization = () => {
  const { token, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [orgData, setOrgData] = useState(null);
  const [users, setUsers] = useState([]);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Lead' });
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [message, setMessage] = useState('');

  const config = {
    headers: { 'x-auth-token': token },
  };

  const fetchOrgData = async () => {
    try {
      const res = await axios.get('/api/users/org-users', config);
      setUsers(res.data);
      // In a real app, we'd have a separate endpoint for Org details, 
      // but for now we'll mock it or extract it from user object if available
      setOrgData({
        name: 'AgencyOS Legacy', // Default or from context
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
    fetchOrgData();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users/invite', inviteForm, config);
      setMessage('Invitation sent successfully!');
      setInviteForm({ name: '', email: '', role: 'Lead' });
      setShowInviteModal(false);
      fetchOrgData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || 'Error sending invitation');
    }
  };

  const tiers = [
    { 
      name: 'Free', 
      icon: <Zap size={20} />, 
      price: '$0', 
      features: ['3 Projects', 'Basic Task Tracking', 'Email Support'],
      active: orgData?.tier === 'Free'
    },
    { 
      name: 'Pro', 
      icon: <Gem size={20} />, 
      price: '$49', 
      features: ['Unlimited Projects', 'Automated Invoicing', 'RICE Scoring', 'Team Insights'],
      active: orgData?.tier === 'Pro' || orgData?.tier === 'Enterprise' // Dummy check
    },
    { 
      name: 'Enterprise', 
      icon: <Star size={20} />, 
      price: '$199', 
      features: ['AI Predictive Analytics', 'Capacity Planning', 'Client Portal', 'Custom Branding'],
      active: orgData?.tier === 'Enterprise'
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
          <p className="text-slate-400">Manage your workspace, team, and subscription tier.</p>
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

      {message && (
        <div className="bg-blue-500/10 border border-blue-500/50 text-blue-400 px-4 py-3 rounded-xl flex items-center space-x-3">
          <Activity size={18} />
          <span className="font-semibold text-sm">{message}</span>
        </div>
      )}

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Section */}
        <div className="lg:col-span-2 space-y-8">
          
          {activeTab === 'overview' && (
            <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 space-y-6">
              <h3 className="text-xl font-bold flex items-center space-x-2">
                <Shield size={20} className="text-blue-500" />
                <span>Workspace Details</span>
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Organization Name</p>
                  <p className="text-white font-medium text-lg">{orgData?.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Tier</p>
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-500/20 text-blue-400 text-xs font-black px-2 py-1 rounded-md uppercase">
                      {orgData?.tier}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Owner</p>
                  <p className="text-white font-medium">{orgData?.owner}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Manage Members</h3>
                <button 
                  onClick={() => setShowInviteModal(true)}
                  className="premium-gradient flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Plus size={18} />
                  <span>Invite Member</span>
                </button>
              </div>

              <div className="bg-[#111111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">User</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Role</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/30">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-white font-bold">{u.name}</p>
                              <p className="text-slate-500 text-xs">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                            u.role === 'Admin' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            u.role === 'Lead' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 text-emerald-500">
                            <CheckCircle size={14} />
                            <span className="text-xs font-bold">Active</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold">Upgrade Your Experience</h3>
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
                        <li key={f} className="flex items-center space-x-2 text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                          <CheckCircle size={12} className="text-blue-500" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {!tier.active && (
                      <button className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-all hover:translate-y-[-2px] active:translate-y-[0px]">
                        Get Started
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Payment Gateway Mockup */}
              <div className="bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/20 rounded-3xl p-10 flex flex-col items-center text-center space-y-6">
                <div className="p-4 bg-blue-500 rounded-full shadow-2xl shadow-blue-500/50 animate-bounce">
                  <CreditCard size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">Secure Payment Gateway</h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    Integration with Stripe & PayPal is currently being finalized. All premium features will be unlocked once the gateway goes live.
                  </p>
                </div>
                <div className="flex space-x-4 opacity-30 grayscale pointer-events-none">
                  <div className="h-8 w-16 bg-white rounded flex items-center justify-center font-bold text-black text-[10px]">VISA</div>
                  <div className="h-8 w-16 bg-white rounded flex items-center justify-center font-bold text-black text-[10px]">STRIPE</div>
                  <div className="h-8 w-16 bg-white rounded flex items-center justify-center font-bold text-black text-[10px]">PAYPAL</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Sidebar Mini Profile */}
        <div className="space-y-6">
          <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative h-24 w-24 rounded-3xl premium-gradient flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-blue-500/20">
                {user.name.charAt(0)}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-black">{user.name}</h4>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{user.role}</p>
            </div>
            <div className="flex justify-center space-x-2">
              <div className="p-2 bg-white/5 rounded-xl hover:text-blue-500 transition-colors cursor-pointer">
                <Mail size={16} />
              </div>
              <div className="p-2 bg-white/5 rounded-xl hover:text-blue-500 transition-colors cursor-pointer">
                <Shield size={16} />
              </div>
            </div>
          </div>

          <div className="bg-blue-600/5 border border-blue-500/10 rounded-3xl p-6 space-y-4">
            <h5 className="text-xs font-black text-blue-500 uppercase tracking-widest">Organization Stats</h5>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-bold">Total Members</span>
                <span className="text-white font-black">{users.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-bold">Storage Used</span>
                <span className="text-white font-black">2.4 GB</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[45%]"></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-[#000000]/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#111111] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black tracking-tight">Invite New Member</h2>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleInvite} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                <input 
                  type="text" 
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({...inviteForm, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-700" 
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                <input 
                  type="email" 
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-700" 
                  placeholder="john@agency.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Assign Role</label>
                <select 
                   value={inviteForm.role}
                   onChange={(e) => setInviteForm({...inviteForm, role: e.target.value})}
                   className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 appearance-none transition-all"
                >
                  <option value="Lead">Lead/Employee (Contributor)</option>
                  <option value="Client">Client (Stakeholder)</option>
                  <option value="Admin">Admin/Manager (Owner)</option>
                </select>
              </div>
              
              <button 
                type="submit"
                className="w-full premium-gradient py-5 rounded-2xl text-white font-black text-lg shadow-xl shadow-blue-500/25 hover:translate-y-[-2px] active:translate-y-[1px] transition-all flex items-center justify-center space-x-3 mt-4"
              >
                <Plus size={22} />
                <span>Send Access Invite</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Organization;
