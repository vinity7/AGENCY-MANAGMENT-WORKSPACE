import React from 'react';
import { 
  Users, 
  Crown, 
  Code, 
  Trophy, 
  Shield, 
  User, 
  Briefcase,
  Layers,
  CheckCircle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const RoleSelector = ({ selectedRole, onRoleSelect }) => {
  const [activeTab, setActiveTab] = React.useState('scrum');

  const scrumRoles = [
    {
      id: 'product_owner',
      label: 'Product Owner',
      icon: <Crown className="text-amber-400" />,
      description: 'Visionary & Backlog Owner',
      permissions: ['Manage Backlog', 'Prioritize Features', 'View Roadmap']
    },
    {
      id: 'product_manager',
      label: 'Product Manager',
      icon: <Layers className="text-blue-400" />,
      description: 'Strategy & Roadmap',
      permissions: ['Manage Roadmap', 'Market Analysis', 'Requirements']
    },
    {
      id: 'developer',
      label: 'Developer',
      icon: <Code className="text-emerald-400" />,
      description: 'Implementation & Logic',
      permissions: ['Execution View', 'Task Management', 'Capacity Guard']
    },
    {
      id: 'scrum_master',
      label: 'Scrum Master',
      icon: <Trophy className="text-purple-400" />,
      description: 'Process & Velocity',
      permissions: ['Sprint Planner', 'Team Analytics', 'Retrospectives']
    }
  ];

  const legacyRoles = [
    {
      id: 'owner',
      label: 'Owner',
      icon: <Shield className="text-rose-400" />,
      description: 'Full Workspace Control',
      permissions: ['Financial Access', 'Member Management', 'Settings']
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: <Users className="text-indigo-400" />,
      description: 'Legacy Organizational Admin',
      permissions: ['Manage Users', 'View Dashboard', 'Settings']
    },
    {
      id: 'contributor',
      label: 'Contributor',
      icon: <User className="text-slate-400" />,
      description: 'Individual Contributor',
      permissions: ['Assigned Tasks', 'Comments', 'Track Time']
    },
    {
      id: 'client',
      label: 'Client',
      icon: <Briefcase className="text-sky-400" />,
      description: 'External Stakeholder',
      permissions: ['View Own Projects', 'View Invoices', 'Approve Work']
    }
  ];

  const currentRoles = activeTab === 'scrum' ? scrumRoles : legacyRoles;

  return (
    <div className="space-y-6">
      <div className="flex space-x-1 bg-white/5 p-1 rounded-2xl w-full">
        <button
          onClick={() => setActiveTab('scrum')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'scrum' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers size={16} />
          <span>Scrum Roles</span>
        </button>
        <button
          onClick={() => setActiveTab('legacy')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'legacy' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users size={16} />
          <span>Legacy Roles</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        {currentRoles.map((role) => (
          <div
            key={role.id}
            onClick={() => onRoleSelect(role.id)}
            className={`cursor-pointer p-4 rounded-2xl border transition-all ${
              selectedRole === role.id
                ? 'bg-blue-600/10 border-blue-500 ring-2 ring-blue-500/20 shadow-xl'
                : 'bg-white/5 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl ${selectedRole === role.id ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400'}`}>
                  {role.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{role.label}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{role.description}</p>
                </div>
              </div>
              {selectedRole === role.id && <CheckCircle size={16} className="text-blue-500 animate-in zoom-in" />}
            </div>
            
            <div className="space-y-1.5 mt-4">
              {role.permissions.map((p, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-[10px] text-slate-400">
                  <span className="h-1 w-1 rounded-full bg-blue-500/50" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;
