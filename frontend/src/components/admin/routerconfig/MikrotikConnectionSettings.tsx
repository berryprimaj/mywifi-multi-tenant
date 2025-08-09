import React, { useState } from 'react';
import { Router, Save, Globe, Server, CheckCircle, AlertCircle } from 'lucide-react';
import { ApiKeys } from '../../../contexts/SettingsContext';
import toast from 'react-hot-toast';

interface MikrotikConnectionSettingsProps {
  apiKeys: ApiKeys;
  updateApiKeys: (newKeys: Partial<ApiKeys>) => void;
  saveSettingsToBackend: () => Promise<void>;
  handleTestConnection: () => Promise<void>;
  isOnlineMode: boolean;
  setIsOnlineMode: (mode: boolean) => void;
}

const MikrotikConnectionSettings: React.FC<MikrotikConnectionSettingsProps> = ({
  apiKeys,
  updateApiKeys,
  saveSettingsToBackend,
  handleTestConnection,
  isOnlineMode,
  setIsOnlineMode,
}) => {
  const [ddnsStatus, setDdnsStatus] = useState<{
    loading: boolean;
    resolved: boolean;
    ip?: string;
    message?: string;
  }>({ loading: false, resolved: false });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateApiKeys({ [`mikrotik${name.charAt(0).toUpperCase() + name.slice(1)}`]: value });
  };

  const testDDNS = async () => {
    if (!apiKeys.mikrotikHost) {
      toast.error('Please enter a host address first');
      return;
    }

    setDdnsStatus({ loading: true, resolved: false });

    try {
      const response = await fetch('/api/mikrotik/test-ddns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ host: apiKeys.mikrotikHost })
      });

      const result = await response.json();

      if (result.success) {
        setDdnsStatus({
          loading: false,
          resolved: true,
          ip: result.data.resolved_ip,
          message: result.message
        });
        toast.success(`DDNS resolved successfully: ${result.data.resolved_ip}`);
      } else {
        setDdnsStatus({
          loading: false,
          resolved: false,
          message: result.message
        });
        toast.error(result.message);
      }
    } catch (error) {
      setDdnsStatus({
        loading: false,
        resolved: false,
        message: 'Failed to test DDNS'
      });
      toast.error('Failed to test DDNS resolution');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Router className="w-5 h-5 mr-2 text-blue-600" />
          MikroTik API Connection
        </h3>
        <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setIsOnlineMode(true)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${isOnlineMode ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
          >
            <Globe className="w-4 h-4 mr-2" />
            Online (Hosting)
          </button>
          <button
            onClick={() => setIsOnlineMode(false)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${!isOnlineMode ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
          >
            <Server className="w-4 h-4 mr-2" />
            Offline (Lokal)
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isOnlineMode ? 'Host (IP Publik / DDNS)' : 'Host (IP Lokal)'}
          </label>
          <div className="relative">
            <input 
              type="text" 
              name="host" 
              value={apiKeys.mikrotikHost} 
              onChange={handleInputChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-20" 
              placeholder={isOnlineMode ? 'e.g., your.ddns.net or IP publik dari PPP' : 'e.g., 192.168.1.1'} 
            />
            {isOnlineMode && apiKeys.mikrotikHost && (
              <button
                onClick={testDDNS}
                disabled={ddnsStatus.loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {ddnsStatus.loading ? 'Testing...' : 'Test DDNS'}
              </button>
            )}
          </div>
          
          {/* DDNS Status Display */}
          {isOnlineMode && ddnsStatus.message && (
            <div className={`mt-2 p-2 rounded text-xs flex items-center ${
              ddnsStatus.resolved 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {ddnsStatus.resolved ? (
                <CheckCircle className="w-4 h-4 mr-1" />
              ) : (
                <AlertCircle className="w-4 h-4 mr-1" />
              )}
              <span>
                {ddnsStatus.resolved 
                  ? `DDNS resolved: ${apiKeys.mikrotikHost} → ${ddnsStatus.ip}`
                  : ddnsStatus.message
                }
              </span>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">API Port</label>
          <input type="text" name="port" value={apiKeys.mikrotikPort} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., 8728" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input type="text" name="username" value={apiKeys.mikrotikUsername} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" name="password" value={apiKeys.mikrotikPassword} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-end items-center mt-6 space-y-3 sm:space-y-0 sm:space-x-4">
        <button onClick={handleTestConnection} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 w-full sm:w-auto">Test Connection</button>
        <button
          onClick={saveSettingsToBackend}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 w-full sm:w-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Connection Settings</span>
        </button>
      </div>
    </div>
  );
};

export default MikrotikConnectionSettings;