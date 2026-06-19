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
  ShieldCheck,
  Loader2
} from 'lucide-react';

const AddUserModal = ({ isOpen, onClose, onUserAdded, token }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'developer',
    department: '',
    jobTitle: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const config = {
        headers: { 'x-auth-token': token }
      };

      const res = await axios.post('/api/v1/organizations/users/create', formData, config);
      
      // Notify parent component with a custom success message
      onUserAdded(`Successfully provisioned ${formData.name} as ${formData.role.replace('_', ' ')}.`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        role: 'developer',
        department: '',
        jobTitle: '',
        password: ''
      });

      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.msg || 'Error creating user');
    } finally {
      setLoading(false);
    }
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

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
          
          {/* Left Sidebar Info */}
          <div className="hidden md:flex md:col-span-4 bg-blue-600 p-10 flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
             
             <div className="space-y-6 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <UserPlus className="text-white" />
                </div>
                <h2 className="text-2xl font-black text-white leading-tight">Provision Access</h2>
                <p className="text-blue-100/70 text-sm font-medium">
                  Directly add members to your organization and choose their specialized workspace role.
                </p>
             </div>

             <div className="space-y-2 relative z-10">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Workspace Status</p>
                <div className="flex items-center space-x-2 text-white">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs font-bold">Tenant Environment Active</span>
                </div>
             </div>
          </div>

          {/* Form Content */}
          <div className="col-span-1 md:col-span-8 p-10 flex flex-col justify-between">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Add Team Member</h3>
                <p className="text-slate-500 text-xs">Instantly instantiate user credentials within isolated company environment.</p>
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-2.5 rounded-xl text-xs font-semibold text-center">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] px-1">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-medium placeholder:text-slate-700"
                      placeholder="e.g. Sarah Jenkins"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] px-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-medium placeholder:text-slate-700"
                      placeholder="sarah@agency.com"
                      required
                    />
                  </div>
                </div>

                {/* Initial Manual Password - Text Input Field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] px-1">Initial Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input 
                      type="text" 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-medium placeholder:text-slate-700"
                      placeholder="Enter a secure manual password"
                      required
                    />
                  </div>
                </div>

                {/* Role Dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] px-1">Workspace Product Role *</label>
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-[#111111] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-medium appearance-none"
                    required
                  >
                    <option value="product_owner">Product Owner</option>
                    <option value="product_manager">Product Manager</option>
                    <option value="developer">Developer</option>
                  </select>
                </div>

                {/* Department and Job Title */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] px-1">Department</label>
                    <input 
                      type="text" 
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-medium placeholder:text-slate-700"
                      placeholder="Engineering"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] px-1">Job Title</label>
                    <input 
                      type="text" 
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-medium placeholder:text-slate-700"
                      placeholder="Sr. Developer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/5">
                <button 
                  type="button"
                  onClick={onClose} 
                  className="px-6 py-3 text-slate-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Provisioning...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={14} />
                      <span>Provision User</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
