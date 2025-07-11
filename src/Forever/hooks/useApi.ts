import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { ApiService, mockApiService } from '../services/apiService';

// Custom hook for API operations with loading states and error handling
export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const executeRequest = async <T>(
    request: () => Promise<T>,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await request();
      if (successMessage) {
        showToast(successMessage);
      }
      return result;
    } catch (err) {
      const message = errorMessage || 'An error occurred';
      setError(message);
      showToast(message, 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Use mock service for development, switch to ApiService for production
  const apiService = import.meta.env.MODE === 'development' ? mockApiService : ApiService;

  return {
    isLoading,
    error,
    executeRequest,
    apiService,
  };
};