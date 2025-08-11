import { useAuth } from '@clerk/nextjs';
import { apiClient, ApiResponse } from '@/lib/api';
import { useState, useCallback } from 'react';

export function useApi() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = useCallback(async <T>(
    apiFunction: (token: string, ...args: any[]) => Promise<ApiResponse<T>>,
    ...args: any[]
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await apiFunction(token, ...args);
      
      if (!response.success) {
        throw new Error(response.error || 'API call failed');
      }

      return response.data || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  return {
    loading,
    error,
    apiCall,
    clearError: () => setError(null),
  };
}

// Specific hooks for different API operations
export function useEvents() {
  const { apiCall, loading, error, clearError } = useApi();

  const getEvents = useCallback(() => {
    return apiCall(apiClient.getEvents);
  }, [apiCall]);

  const createEvent = useCallback((eventData: any) => {
    return apiCall(apiClient.createEvent, eventData);
  }, [apiCall]);

  const getEvent = useCallback((eventId: string) => {
    return apiCall(apiClient.getEvent, eventId);
  }, [apiCall]);

  const updateEvent = useCallback((eventId: string, eventData: any) => {
    return apiCall(apiClient.updateEvent, eventId, eventData);
  }, [apiCall]);

  const deleteEvent = useCallback((eventId: string) => {
    return apiCall(apiClient.deleteEvent, eventId);
  }, [apiCall]);

  return {
    getEvents,
    createEvent,
    getEvent,
    updateEvent,
    deleteEvent,
    loading,
    error,
    clearError,
  };
}

export function useGuests() {
  const { apiCall, loading, error, clearError } = useApi();

  const getEventGuests = useCallback((eventId: string) => {
    return apiCall(apiClient.getEventGuests, eventId);
  }, [apiCall]);

  const getEventStats = useCallback((eventId: string) => {
    return apiCall(apiClient.getEventStats, eventId);
  }, [apiCall]);

  const createGuest = useCallback((guestData: any) => {
    return apiCall(apiClient.createGuest, guestData);
  }, [apiCall]);

  return {
    getEventGuests,
    getEventStats,
    createGuest,
    loading,
    error,
    clearError,
  };
}

export function useProfile() {
  const { apiCall, loading, error, clearError } = useApi();

  const getProfile = useCallback(() => {
    return apiCall(apiClient.getProfile);
  }, [apiCall]);

  const updateProfile = useCallback((profileData: any) => {
    return apiCall(apiClient.updateProfile, profileData);
  }, [apiCall]);

  return {
    getProfile,
    updateProfile,
    loading,
    error,
    clearError,
  };
} 