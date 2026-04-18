import React, { useState } from 'react';
import axios from 'axios';
import { 
  X, 
  UserPlus, 
  User,
  Mail, 
  Lock, 
  Building, 
  Briefcase, 
  CheckCircle,
  Copy,
  ChevronRight,
  ShieldCheck,
  ClipboardCheck,
  Loader2
} from 'lucide-react';
import RoleSelector from './RoleSelector';

const AddUserModal = ({ isOpen, onClose, onUserAdded, token }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdUserData, setCreatedUserData] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'developer',
    department: '',
    jobTitle: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const config = {
        headers: { 'x-auth-token': token }
      };

      const res = await axios.post('/api/v1/organizations/users/create', formData, config);
      
      setCreatedUserData(res.data.data);
      setStep(3);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Error creating user');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast here
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/80 backdrop-blur-xl z-[150] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-[#0b0b0b] border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-slate-500 hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
          
          {/* Left Sidebar Info */}
          <div className="hidden md:flex md:col-span-4 bg-blue-600 p-10 flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
             
             <div className="space-y-6 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <UserPlus className="text-white" />
                </div>
                <h2 className="text-2xl font-black text-white leading-tight">Provision Instant Access</h2>
                <p className="text-blue-100/70 text-sm font-medium">
                  Directly add members to your organization without waiting for email invites.
                </p>
             </div>

             <div className="space-y-4 relative z-10">
                <div className="flex items-center space-x-3 text-white/40">
                   <div className={`h-2 w-2 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/20'}`}></div>
                   <span className="text-xs font-bold uppercase tracking-widest">Identify</span>
                </div>
                <div className="flex items-center space-x-3 text-white/40">
                   <div className={`h-2 w-2 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/20'}`}></div>
                   <span className="text-xs font-bold uppercase tracking-widest">Assign Role</span>
                </div>
                <div className="flex items-center space-x-3 text-white/40">
                   <div className={`h-2 w-2 rounded-full ${step >= 3 ? 'bg-white' : 'bg-white/20'}`}></div>
                   <span className="text-xs font-bold uppercase tracking-widest">Onboard</span>
                </div>
             </div>
          </div>

          {/* Form Content */}
          <div className="col-span-1 md:col-span-8 p-10 flex flex-col">
            
            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Member Details</h3>
                  <p className="text-slate-500 text-sm">Enter the basic profile information for the new user.</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium"
                        placeholder="e.g. Sarah Jenkins"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium"
                        placeholder="sarah@agency.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Department</label>
                      <input 
                        type="text" 
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium"
                        placeholder="Engineering"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Job Title</label>
                      <input 
                        type="text" 
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium"
                        placeholder="Sr. Frontend dev"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    disabled={!formData.name || !formData.email}
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                  >
                    <span>Assign Role</span>
                    <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 h-full flex flex-col">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Select Organization Role</h3>
                  <p className="text-slate-500 text-sm">Determine which permissions this user will inherit.</p>
                </div>

                <div className="flex-1">
                  <RoleSelector 
                    selectedRole={formData.role} 
                    onRoleSelect={(role) => setFormData({...formData, role})} 
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Manual Password (Optional)</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <input 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium"
                        placeholder="Leave blank to auto-generate"
                      />
                    </div>
                  </div>

                  {error && <p className="text-rose-500 text-xs font-bold text-center">{error}</p>}

                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl mb-4">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Action</p>
                     <div className="flex space-x-3">
                        <button onClick={handleBack} className="px-6 py-2 text-slate-400 hover:text-white font-bold text-sm">Back</button>
                        <button 
                          onClick={handleSubmit}
                          disabled={loading}
                          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all flex items-center space-x-2"
                        >
                          {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                          <span>Create User</span>
                        </button>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-10 animate-in zoom-in duration-500 h-full flex flex-col items-center justify-center text-center">
                <div className="h-24 w-24 rounded-[2rem] bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center relative">
                   <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse"></div>
                   <CheckCircle className="text-emerald-500 relative z-10" size={48} />
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-white">Member Provisioned!</h3>
                  <p className="text-slate-400 text-sm max-w-[300px] mx-auto">
                    Access has been granted for {createdUserData?.name}. Copy the entry credentials below.
                  </p>
                </div>

                <div className="w-full max-w-[350px] space-y-3">
                   <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between group">
                      <div className="text-left">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Generated Password</p>
                        <p className="text-white font-mono font-bold tracking-widest text-lg">{createdUserData?.generatedPassword}</p>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(createdUserData?.generatedPassword)}
                        className="p-3 bg-white/5 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-slate-400"
                      >
                        <Copy size={20} />
                      </button>
                   </div>
                   <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between group">
                      <div className="text-left">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Login URL</p>
                        <p className="text-white font-medium text-xs truncate max-w-[200px]">{createdUserData?.loginUrl}</p>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(createdUserData?.loginUrl)}
                        className="p-3 bg-white/5 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-slate-400"
                      >
                        <Copy size={20} />
                      </button>
                   </div>
                </div>

                <div className="flex flex-col w-full space-y-4 pt-6">
                  <button 
                    onClick={() => { setStep(1); setFormData({...formData, name: '', email: '', password: ''}); setCreatedUserData(null); }}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/10"
                  >
                    Create Another
                  </button>
                  <button 
                    onClick={() => { onClose(); onUserAdded(); }}
                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-blue-500/20"
                  >
                    Finish Onboarding
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
