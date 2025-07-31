import React from 'react';
import { Globe } from 'lucide-react';
import { ApiKeys } from '../../../contexts/SettingsContext';

interface GoogleApiSettingsProps {
  apiKeys: ApiKeys;
  updateApiKeys: (newKeys: Partial<ApiKeys>) => void;
}

const GoogleApiSettings: React.FC<GoogleApiSettingsProps> = ({ apiKeys, updateApiKeys }) => {
  const handleInputChange = (key: string, value: string) => {
    updateApiKeys({ [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-6">
        <Globe className="w-5 h-5 text-red-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Google Integration</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Google Client ID</label>
          <input
            type="text"
            value={apiKeys.googleClientId}
            onChange={(e) => handleInputChange('googleClientId', e.target.value)}
            placeholder="Enter your Google Client ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Google Client Secret</label>
          <input
            type="password"
            value={apiKeys.googleClientSecret}
            onChange={(e) => handleInputChange('googleClientSecret', e.target.value)}
            placeholder="Enter your Google Client Secret"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Redirect URI</label>
          <input
            type="url"
            value={apiKeys.googleRedirectUri}
            onChange={(e) => handleInputChange('googleRedirectUri', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-red-50 rounded-lg">
        <p className="text-sm text-red-800">
          <strong>Setup Instructions:</strong> Create a new project in{' '}
          <a href="https://console.developers.google.com" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
            Google Cloud Console
          </a>
          , enable Google+ API, and create OAuth 2.0 credentials.
        </p>
      </div>
    </div>
  );
};

export default GoogleApiSettings;