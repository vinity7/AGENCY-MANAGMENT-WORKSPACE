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
      } else if (roleLower === 'product_manager') {
        mockData = {
          roleName: 'Product Manager',
          stats: [
            { title: 'Project Health', value: 'Over 92%', trend: 'Good', color: 'emerald' },
            { title: 'Stakeholders', value: '14', trend: 'Active', color: 'blue' },
            { title: 'Budget Status', value: 'On Track', trend: '-2% dev', color: 'indigo' },
            { title: 'Roadmap Progress', value: '68%', trend: '+4%', color: 'purple' }
          ],
          charts: {
            roadmap: [
              { name: 'Core API', progress: 100 },
              { name: 'Dashboard', progress: 85 },
              { name: 'Billing', progress: 40 },
              { name: 'Analytics', progress: 15 }
            ]
          },
          activities: [
            { type: 'milestone', user: 'PM System', action: 'reached milestone', target: 'Beta Release', time: '1 day ago' }
          ]
        };
      } else if (roleLower === 'scrum_master') {
        mockData = {
          roleName: 'Scrum Master',
          stats: [
            { title: 'Current Sprint', value: 'Sprint 46', trend: '8 days remaining', color: 'blue' },
            { title: 'Points Progress', value: '45 / 60', trend: '75% Complete', color: 'indigo' },
            { title: 'Team happiness', value: '4.2 / 5.0', trend: '+0.1 this week', color: 'emerald' },
            { title: 'Active Blockers', value: '2', trend: 'Requires Attention', color: 'rose' }
          ],
          blockers: [
            { id: 1, title: 'API Rate Limit - Prod', severity: 'P0', owner: 'DevOps', age: '2 days old', status: 'Blocked' },
            { id: 2, title: 'Missing Design Assets', severity: 'P1', owner: 'Design', age: '1 day old', status: 'In Progress' }
          ],
          charts: {
            burndown: [
              { day: 'Day 1', actual: 60, ideal: 60 },
              { day: 'Day 2', actual: 58, ideal: 55 },
              { day: 'Day 3', actual: 52, ideal: 50 },
              { day: 'Day 4', actual: 48, ideal: 45 },
              { day: 'Day 5', actual: 45, ideal: 40 },
              { day: 'Day 6', actual: 42, ideal: 35 },
              { day: 'Day 7', actual: 35, ideal: 30 },
              { day: 'Day 8', actual: null, ideal: 25 },
              { day: 'Day 9', actual: null, ideal: 20 },
              { day: 'Day 10', actual: null, ideal: 0 }
            ],
            velocity: [
              { name: 'Sprint 41', points: 42 },
              { name: 'Sprint 42', points: 48 },
              { name: 'Sprint 43', points: 45 },
              { name: 'Sprint 44', points: 52 },
              { name: 'Sprint 45', points: 58 },
              { name: 'Sprint 46', points: 45 }
            ],
            happiness: [
              { day: 'Mon', score: 3.8 },
              { day: 'Tue', score: 4.0 },
              { day: 'Wed', score: 4.2 },
              { day: 'Thu', score: 4.1 },
              { day: 'Fri', score: 4.3 }
            ]
          },
          retrospective: {
            feedback: [
              { id: 1, text: "The daily standups are getting too long.", category: "process", votes: 4 },
              { id: 2, text: "Great teamwork on the API migration!", category: "celebration", votes: 6 },
              { id: 3, text: "Need better documentation for the CI/CD pipeline.", category: "tooling", votes: 3 }
            ],
            actionItems: [
              { id: 101, text: "Timebox standups to 15 mins", status: "In Progress", owner: "SM" },
              { id: 102, text: "Schedule CI/CD deep dive", status: "Todo", owner: "Tech Lead" }
            ]
          },
          activities: [
            { type: 'blocker_added', user: 'Alex Dev', action: 'flagged blocker', target: 'API Rate Limit', time: '2 hours ago' },
            { type: 'task_done', user: 'Sarah', action: 'completed', target: 'Dashboard Auth', time: '5 hours ago' }
          ]
        };
      } else if (roleLower === 'client') {
        mockData = {
          roleName: 'Client Portal',
          stats: [
            { title: 'Project Status', value: 'In Progress', trend: 'On Schedule', color: 'blue' },
            { title: 'Last Invoice', value: '$4,200', trend: 'Paid', color: 'emerald' },
            { title: 'Unresolved Issues', value: '3', trend: 'Low Priority', color: 'amber' },
            { title: 'Next Milestone', value: 'Beta', trend: 'May 15', color: 'indigo' }
          ],
          charts: {
            budget: [
              { name: 'Used', value: 65 },
              { name: 'Remaining', value: 35 }
            ]
          },
          activities: [
            { type: 'milestone', user: 'AgencyOS', action: 'completed milestone', target: 'Design Phase', time: '1 week ago' }
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
