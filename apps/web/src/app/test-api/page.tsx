'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export default function TestApiPage() {
  const [healthStatus, setHealthStatus] = useState<string>('Loading...');
  const [apiStatus, setApiStatus] = useState<string>('Not tested');

  useEffect(() => {
    // Test backend health endpoint
    const testHealth = async () => {
      try {
        const response = await fetch('http://localhost:3001/health');
        if (response.ok) {
          const data = await response.json();
          setHealthStatus(`✅ Backend Healthy: ${JSON.stringify(data)}`);
        } else {
          setHealthStatus(`❌ Backend Error: ${response.status}`);
        }
      } catch (error) {
        setHealthStatus(`❌ Connection Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    testHealth();
  }, []);

  const testApiClient = async () => {
    setApiStatus('Testing...');
    try {
      // Test a simple API call (this will fail without auth, but we can see the connection)
      const response = await apiClient.getEvents('test-token');
      setApiStatus(`✅ API Client Working: ${response.success ? 'Success' : 'Failed'}`);
    } catch (error) {
      setApiStatus(`❌ API Client Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Connection Test</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Backend Health Check</h2>
          <p className="text-gray-600">{healthStatus}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">API Client Test</h2>
          <p className="text-gray-600 mb-4">{apiStatus}</p>
          <button
            onClick={testApiClient}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Test API Client
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="space-y-2">
            <p className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Frontend: Running on port 3002
            </p>
            <p className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Backend: Running on port 3001
            </p>
            <p className="flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              API Client: Configured
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 