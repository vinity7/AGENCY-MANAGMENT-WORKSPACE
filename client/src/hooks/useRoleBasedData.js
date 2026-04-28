import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

/**
 * Custom hook to fetch role-specific dashboard data
 */
export const useRoleBasedData = (role, timeRange = 'Month') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoleData = useCallback(async () => {
    if (!role) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.get('/dashboard/stats');
      setData(res.data);
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
