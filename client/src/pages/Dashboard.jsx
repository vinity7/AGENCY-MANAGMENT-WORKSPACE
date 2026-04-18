import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRoleBasedData } from '../hooks/useRoleBasedData';

// Dashboards
import OrganizationLeadDashboard from './dashboards/OrganizationLeadDashboard';
import ProductOwnerDashboard from './dashboards/ProductOwnerDashboard';
import ProductManagerDashboard from './dashboards/ProductManagerDashboard';
import DeveloperDashboard from './dashboards/DeveloperDashboard';
import ScrumMasterDashboard from './dashboards/ScrumMasterDashboard';
import ClientPortalDashboard from './dashboards/ClientPortalDashboard';

const Dashboard = () => {
  const { user, dashboardType } = useContext(AuthContext);
  const [timeRange, setTimeRange] = useState('Month');
  const { data, loading, error } = useRoleBasedData(user?.role, timeRange);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-3xl text-center max-w-md">
           <h3 className="text-xl font-black text-rose-500 mb-2">Sync Error</h3>
           <p className="text-slate-400 font-medium mb-6">{error}</p>
           <button 
             onClick={() => window.location.reload()}
             className="px-8 py-3 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-500/20"
           >
             Retry Synchronization
           </button>
        </div>
      </div>
    );
  }

  // Dashboard Router Logic
  const renderDashboard = () => {
    switch (dashboardType) {
      case 'lead':
        return <OrganizationLeadDashboard data={data} loading={loading} />;
      case 'po':
        return <ProductOwnerDashboard data={data} loading={loading} />;
      case 'pm':
        return <ProductManagerDashboard data={data} loading={loading} />;
      case 'dev':
        return <DeveloperDashboard data={data} loading={loading} />;
      case 'sm':
        return <ScrumMasterDashboard data={data} loading={loading} />;
      case 'client':
        return <ClientPortalDashboard data={data} loading={loading} />;
      default:
        return <DeveloperDashboard data={data} loading={loading} />;
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen pb-20">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
