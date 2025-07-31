import React from 'react';
import { MessageCircle } from 'lucide-react';
import { ApiKeys } from '../../../contexts/SettingsContext';

interface FonteApiSettingsProps {
  apiKeys: ApiKeys;
  updateApiKeys: (newKeys: Partial<ApiKeys>) => void;
}

const FonteApiSettings: React.FC<FonteApiSettingsProps> = ({ apiKeys, updateApiKeys }) => {
  const handleInputChange = (key: string, value: string) => {
    updateApiKeys({ [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-6">
        <MessageCircle className="w-5 h-5 text-green-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Fonte WhatsApp API</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
          <input
            type="text"
            value={apiKeys.fonteApiKey}
            onChange={(e) => handleInputChange('fonteApiKey', e.target.value)}
            placeholder="Enter your Fonte API key"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Device ID</label>
          <input
            type="text"
            value={apiKeys.fonteDeviceId}
            onChange={(e) => handleInputChange('fonteDeviceId', e.target.value)}
            placeholder="Enter your WhatsApp device ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>Note:</strong> Get your Fonte API credentials from{' '}
          <a href="https://fonte.id" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
            fonte.id
          </a>
        </p>
      </div>
    </div>
  );
};

export default FonteApiSettings;