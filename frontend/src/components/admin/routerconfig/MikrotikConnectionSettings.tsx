import React from 'react';
import { Router, Save, Globe, Server } from 'lucide-react';
import { ApiKeys } from '../../../contexts/SettingsContext';

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateApiKeys({ [`mikrotik${name.charAt(0).toUpperCase() + name.slice(1)}`]: value });
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
          <input type="text" name="host" value={apiKeys.mikrotikHost} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder={isOnlineMode ? 'e.g., 123.45.67.89' : 'e.g., 192.168.1.1'} />
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