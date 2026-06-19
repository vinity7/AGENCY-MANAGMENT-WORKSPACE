import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Plus, 
  CheckCircle, 
  Activity, 
  Search, 
  Filter,
  Mail,
  UserPlus,
  ArrowUpDown,
  MoreVertical,
  Shield,
  Layers
} from 'lucide-react';
import AddUserModal from '../../components/team/AddUserModal';

const TeamManagement = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState(null);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const config = {
    headers: { 'x-auth-token': token },
  };

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/v1/organizations/team?type=${filterType}`, config);
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [filterType]);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role, type) => {
    const isScrum = type === 'scrum';
    
    if (isScrum) {
      return (
        <span className="flex items-center space-x-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
          <Layers size={10} />
          <span>{role.replace('_', ' ')}</span>
        </span>
      );
    }

    return (
      <span className="flex items-center space-x-1.5 bg-slate-500/10 text-slate-400 border border-slate-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
        <Shield size={10} />
        <span>{role}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header / Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex bg-white/5 p-1 rounded-xl">
             {['all', 'scrum', 'legacy'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                    filterType === t ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t}
                </button>
             ))}
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="premium-gradient flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <UserPlus size={18} />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Team Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'Total Members', value: users.length, icon: <Users size={16} /> },
           { label: 'Scrum Roles', value: users.filter(u => u.roleType === 'scrum').length, icon: <Layers size={16} /> },
           { label: 'Active Seats', value: users.filter(u => u.status === 'active').length, icon: <CheckCircle size={16} /> },
           { label: 'Remaining', value: 20 - users.length, icon: <Activity size={16} /> }
         ].map((stat, i) => (
           <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-black text-white">{stat.value}</p>
              </div>
              <div className="text-blue-500 opacity-50 bg-blue-500/10 p-2 rounded-lg">
                {stat.icon}
              </div>
           </div>
         ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Syncing organization data...</p>
        </div>
      ) : (
        <div className="bg-[#111111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Member</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center space-x-2 cursor-pointer group">
                   <span>Position / Role</span>
                   <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Department</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center space-y-4">
                       <div className="p-4 bg-white/5 rounded-full text-slate-600">
                          <Search size={32} />
                       </div>
                       <div>
                          <p className="text-white font-bold">No members found</p>
                          <p className="text-slate-500 text-xs">Try adjusting your filters or search terms.</p>
                       </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-600/5 flex items-center justify-center text-blue-400 font-black border border-blue-500/20 group-hover:scale-110 transition-transform">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm tracking-tight">{u.name}</p>
                          <p className="text-slate-500 text-[11px] font-medium">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col space-y-1">
                        <p className="text-slate-200 text-xs font-bold leading-none">{u.jobTitle || 'Team Member'}</p>
                        <div className="w-fit">
                          {getRoleBadge(u.role, u.roleType)}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-slate-400 text-xs font-medium">{u.department || '—'}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-2 text-emerald-500 bg-emerald-500/5 px-2.5 py-1 rounded-lg w-fit border border-emerald-500/10">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{u.status || 'Active'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center space-x-2">
                          <button className="p-2 text-slate-600 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                             <Mail size={16} />
                          </button>
                          <button className="p-2 text-slate-600 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                             <MoreVertical size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      <AddUserModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        token={token}
        onUserAdded={(successMsg) => {
          fetchTeam();
          triggerToast(successMsg || 'User account successfully instantiated within isolated company environment.');
        }}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 bg-[#0b0b0b] border border-emerald-500/30 text-emerald-400 px-6 py-4 rounded-2xl flex items-center space-x-3 shadow-2xl z-[200] animate-in slide-in-from-bottom-5 duration-300">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest">{toast}</span>
        </div>
      )}

    </div>
  );
};

export default TeamManagement;
