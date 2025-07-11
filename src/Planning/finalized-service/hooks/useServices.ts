import { useState, useEffect, useCallback } from 'react';
// Use the new path alias for the import
import { ServiceData, ServiceApiInterface } from 'src/Planning/finalized-service/types';

// This hook can be easily configured with your actual API implementation
export const useServices = (apiClient?: ServiceApiInterface) => {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default mock data - replace with actual API calls
  const defaultServices: ServiceData[] = [
    {
      id: '1',
      type: 'venue',
      name: 'Wedding Venue',
      vendor: 'Grand Ballroom Events',
      contact: { name: 'Sarah Johnson', phone: '(555) 123-4567' },
      status: 'booked',
      contractSigned: '2023-06-15',
      depositPaid: '₹5,000 (50%)',
      notes: 'Includes tables, chairs, and basic linens. Final walkthrough scheduled for April 5.'
    },
    {
      id: '2',
      type: 'catering',
      name: 'Catering',
      vendor: 'Gourmet Delights Catering',
      contact: { name: 'Michael Chen', phone: '(555) 987-6543' },
      status: 'booked',
      customFields: {
        menuSelected: 'Plated dinner - Filet Mignon & Salmon',
        tastingDate: 'January 10, 2024'
      },
      notes: 'Vegan options required for 12 guests. Final headcount due March 15.'
    },
    {
      id: '3',
      type: 'photography',
      name: 'Photography',
      vendor: 'Timeless Moments Photography',
      contact: { name: 'Jessica Williams', phone: '(555) 456-7890' },
      status: 'booked',
      customFields: {
        package: '8 Hours Coverage + Engagement Session',
        shotList: 'Must-have list submitted'
      },
      notes: 'Second shooter included. Timeline meeting scheduled for March 1.'
    }
  ];

  // Load services on mount
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (apiClient?.getServices) {
        const response = await apiClient.getServices();
        if (response.success) {
          setServices(response.data);
        } else {
          setError(response.message || 'Failed to load services');
        }
      } else {
        // Use default data when no API client is provided
        setServices(defaultServices);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const createService = useCallback(async (serviceData: Omit<ServiceData, 'id'>) => {
    setLoading(true);
    setError(null);

    try {
      if (apiClient?.createService) {
        const response = await apiClient.createService(serviceData);
        if (response.success) {
          setServices(prev => [...prev, response.data]);
          return response.data;
        } else {
          setError(response.message || 'Failed to create service');
          return null;
        }
      } else {
        // Mock implementation
        const newService: ServiceData = {
          ...serviceData,
          id: Date.now().toString()
        };
        setServices(prev => [...prev, newService]);
        return newService;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const updateService = useCallback(async (id: string, updates: Partial<ServiceData>) => {
    setLoading(true);
    setError(null);

    try {
      if (apiClient?.updateService) {
        const response = await apiClient.updateService(id, updates);
        if (response.success) {
          setServices(prev => prev.map(service => 
            service.id === id ? { ...service, ...updates } : service
          ));
          return response.data;
        } else {
          setError(response.message || 'Failed to update service');
          return null;
        }
      } else {
        // Mock implementation
        setServices(prev => prev.map(service => 
          service.id === id ? { ...service, ...updates } : service
        ));
        return services.find(s => s.id === id) || null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiClient, services]);

  const deleteService = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      if (apiClient?.deleteService) {
        const response = await apiClient.deleteService(id);
        if (response.success) {
          setServices(prev => prev.filter(service => service.id !== id));
          return true;
        } else {
          setError(response.message || 'Failed to delete service');
          return false;
        }
      } else {
        // Mock implementation
        setServices(prev => prev.filter(service => service.id !== id));
        return true;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  // Calculate progress
  const progress = services.length > 0 
    ? Math.round((services.filter(s => s.status === 'booked').length / services.length) * 100)
    : 0;

  return {
    services,
    loading,
    error,
    progress,
    loadServices,
    createService,
    updateService,
    deleteService
  };
};