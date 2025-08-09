import React from 'react';
import { MessageCircle, Clock, Hash, FileText } from 'lucide-react';
import { ApiKeys } from '../../../contexts/SettingsContext';

interface FonteApiSettingsProps {
  apiKeys: ApiKeys;
  updateApiKeys: (newKeys: Partial<ApiKeys>) => void;
}

const FonteApiSettings: React.FC<FonteApiSettingsProps> = ({ apiKeys, updateApiKeys }) => {
  const handleInputChange = (key: string, value: string | number | boolean) => {
    updateApiKeys({ [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-6">
        <MessageCircle className="w-5 h-5 text-green-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Fonnte WhatsApp API</h3>
      </div>
      
      {/* API Credentials */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-4">Kredensial API</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <input
              type="text"
              value={apiKeys.fonteApiKey}
              onChange={(e) => handleInputChange('fonteApiKey', e.target.value)}
              placeholder="Enter your Fonnte API key"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Device ID</label>
            <input
              type="text"
              value={apiKeys.fonteDeviceId}
              onChange={(e) => handleInputChange('fonteDeviceId', e.target.value)}
              placeholder="Enter your WhatsApp device ID (e.g., device_123456)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Device ID dari dashboard Fonnte.com (bukan nomor telepon)</p>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon WhatsApp</label>
          <input
            type="text"
            value={apiKeys.fontePhoneNumber}
            onChange={(e) => handleInputChange('fontePhoneNumber', e.target.value)}
            placeholder="Enter your WhatsApp phone number (e.g., +6281234567890)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Nomor WhatsApp yang terdaftar di Fonnte.com</p>
        </div>
      </div>

      {/* OTP Settings */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-4">Pengaturan OTP</h4>
        
        {/* Toggle OTP Verification */}
        <div className="mb-4">
          <div className="flex items-center">
            <button
              onClick={() => handleInputChange('fonteOtpEnabled', !apiKeys.fonteOtpEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mr-3 ${
                apiKeys.fonteOtpEnabled ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  apiKeys.fonteOtpEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <label className="text-sm font-medium text-gray-700">Aktifkan Verifikasi OTP</label>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-14">Aktifkan untuk menggunakan verifikasi OTP via WhatsApp</p>
        </div>

        {/* OTP Expiry and Length */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Masa Berlaku OTP (detik)
            </label>
            <input
              type="number"
              min="60"
              max="3600"
              value={apiKeys.fonteOtpExpiry}
              onChange={(e) => handleInputChange('fonteOtpExpiry', parseInt(e.target.value) || 300)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Minimal 60 detik, maksimal 3600 detik (1 jam)</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Hash className="w-4 h-4 mr-1" />
              Panjang Kode OTP
            </label>
            <input
              type="number"
              min="4"
              max="8"
              value={apiKeys.fonteOtpLength}
              onChange={(e) => handleInputChange('fonteOtpLength', parseInt(e.target.value) || 6)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Minimal 4 digit, maksimal 8 digit</p>
          </div>
        </div>

        {/* OTP Template */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <FileText className="w-4 h-4 mr-1" />
            Template Pesan OTP
          </label>
          <textarea
            value={apiKeys.fonteOtpTemplate}
            onChange={(e) => handleInputChange('fonteOtpTemplate', e.target.value)}
            rows={4}
            placeholder="Template pesan OTP yang akan dikirim via WhatsApp"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
          <div className="text-xs text-gray-500 mt-1">
            <p>Variabel yang tersedia:</p>
            <ul className="list-disc list-inside ml-2 mt-1">
              <li><code className="bg-gray-100 px-1 rounded">&#123;otp&#125;</code> - Kode OTP</li>
              <li><code className="bg-gray-100 px-1 rounded">&#123;expiry&#125;</code> - Masa berlaku dalam menit</li>
              <li><code className="bg-gray-100 px-1 rounded">&#123;site_name&#125;</code> - Nama situs</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>Note:</strong> Get your Fonnte API credentials from{' '}
          <a href="https://fonnte.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
            fonnte.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default FonteApiSettings;