import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to fetch role-specific dashboard data
 * Currently implements mock data since backend APIs are being developed
 */
export const useRoleBasedData = (role, timeRange = 'Month') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoleData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const roleLower = role?.toLowerCase();
      
      // Mock Data Generation Logic
      let mockData = {
        stats: [],
        charts: {},
        activities: [],
        quickActions: []
      };

      if (['owner', 'admin'].includes(roleLower)) {
        mockData = {
          roleName: 'Organization Lead',
          stats: [
            { title: 'Total Revenue', value: '$124,500', trend: '+12.5%', color: 'blue' },
            { title: 'Active Projects', value: '18', trend: '+2', color: 'purple' },
            { title: 'Team Members', value: '24', trend: '+4', color: 'indigo' },
            { title: 'Client satisfaction', value: '4.8/5.0', trend: '+0.2', color: 'emerald' }
          ],
          charts: {
            revenueTrend: [
              { month: 'Jan', revenue: 45000, forecast: 42000 },
              { month: 'Feb', revenue: 52000, forecast: 48000 },
              { month: 'Mar', revenue: 48000, forecast: 50000 },
              { month: 'Apr', revenue: 61000, forecast: 55000 },
              { month: 'May', revenue: 55000, forecast: 58000 },
              { month: 'Jun', revenue: 67000, forecast: 62000 }
            ],
            projectHealth: [
              { name: 'On Track', value: 12, color: '#10b981' },
              { name: 'At Risk', value: 4, color: '#f59e0b' },
              { name: 'Delayed', value: 2, color: '#ef4444' }
            ],
            utilization: [
              { name: 'Dev Team', value: 85 },
              { name: 'Product', value: 72 },
              { name: 'Design', value: 94 },
              { name: 'QA', value: 65 }
            ]
          },
          activities: [
            { type: 'client_added', user: 'Sarah Jenkins', action: 'added new client', target: 'TechFlow Inc', time: '2 hours ago' },
            { type: 'project_completed', user: 'Mike Ross', action: 'completed project', target: 'Payment Gateway Integration', time: '5 hours ago' },
            { type: 'invoice_paid', user: 'System', action: 'processed payment of', target: '$4,200', time: '1 day ago' }
          ],
          quickActions: [
            { label: 'Export Report', path: '/reports' },
            { label: 'Invite Member', path: '/organization' },
            { label: 'Create Project', path: '/projects' }
          ]
        };
      } else if (roleLower === 'product_owner') {
        mockData = {
          roleName: 'Product Owner',
          stats: [
            { title: 'Backlog Health', value: '84%', trend: 'Good', color: 'amber' },
            { title: 'Open Epics', value: '7', trend: 'Stable', color: 'orange' },
            { title: 'Stakeholder Requests', value: '32', trend: '+5', color: 'blue' },
            { title: 'Sprint Velocity', value: '42 pts', trend: '+3', color: 'emerald' }
          ],
          charts: {
            priorityMatrix: [
              { x: 8, y: 7, z: 5, name: 'AI Search', confidence: 'High' },
              { x: 3, y: 4, z: 2, name: 'Dark Mode', confidence: 'Low' },
              { x: 9, y: 3, z: 8, name: 'Export PDF', confidence: 'Med' },
              { x: 5, y: 9, z: 4, name: 'SSO Login', confidence: 'High' }
            ],
            sprintProgress: {
              completion: 65,
              totalTasks: 24,
              doneTasks: 16,
              daysLeft: 4
            }
          },
          activities: [
            { type: 'task_done', user: 'Alex Dev', action: 'moved to review', target: 'Feature: Dashboard', time: '10 mins ago' },
            { type: 'client_added', user: 'Product Bot', action: 'captured request', target: 'Mobile App Sync', time: '1 hour ago' }
          ]
        };
      } else if (roleLower === 'developer' || roleLower === 'contributor') {
        mockData = {
          roleName: 'Developer',
          stats: [
            { title: 'Assigned Tasks', value: '6', trend: 'Manageable', color: 'emerald' },
            { title: 'PRs Open', value: '2', trend: 'In Review', color: 'blue' },
            { title: 'Daily Hours', value: '5.5h', trend: 'Target 6h', color: 'indigo' },
            { title: 'Blockers', value: '1', trend: 'Action Required', color: 'rose' }
          ],
          charts: {
            tasks: {
              todo: [
                { id: 1, name: 'API Integration', priority: 'High', project: 'AgencyOS' },
                { id: 2, name: 'Fix Sidebar Bug', priority: 'Med', project: 'Nightingale' }
              ],
              doing: [
                { id: 3, name: 'Role Dashboards', priority: 'High', project: 'AgencyOS' }
              ],
              done: [
                { id: 4, name: 'Auth Update', priority: 'Low', project: 'Legacy Tool' }
              ]
            }
          },
          activities: [
            { type: 'task_done', user: 'System', action: 'assigned you to', target: 'Bug #402: Login Crash', time: '30 mins ago' }
          ]
        };
      }
      
      setData(mockData);
    } catch (err) {
      console.error('Error fetching role dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [role, timeRange]);

  useEffect(() => {
    fetchRoleData();
  }, [fetchRoleData]);

  return { data, loading, error, refetch: fetchRoleData };
};
