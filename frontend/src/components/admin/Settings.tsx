import { Save } from 'lucide-react';
import Layout from './Layout';
import { useSettings } from '../../contexts/SettingsContext';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Import modular components
import HotspotAppearanceSettings from './settings/HotspotAppearanceSettings';
import AdminAppearanceSettings from './settings/AdminAppearanceSettings';
import FonteApiSettings from './settings/FonteApiSettings';
import GoogleApiSettings from './settings/GoogleApiSettings';

const Settings = () => {
  const {
    settings,
    updateSettings,
    adminSettings,
    updateAdminSettings,
    apiKeys,
    updateApiKeys,
    saveSettingsToBackend
  } = useSettings();

  const { user } = useAuth();

  // Removed fetchSettingsFromBackend call to prevent theme reset
  // Settings are already loaded by SettingsContext on tenant change

  const handleSave = async () => {
    await saveSettingsToBackend();
  };

  // Determine if the current user has permission to view API settings
  const canViewApiSettings = user?.role === 'super_admin' || user?.role === 'administrator';

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300">Configure your hotspot system settings</p>
        </div>

        {/* Hotspot Login Appearance & Branding */}
        <HotspotAppearanceSettings 
          settings={settings} 
          updateSettings={updateSettings} 
        />

        {/* Admin Login Appearance & Branding */}
        <AdminAppearanceSettings 
          adminSettings={adminSettings} 
          updateAdminSettings={updateAdminSettings} 
        />

        {/* Conditional rendering for API Keys sections */}
        {canViewApiSettings && (
          <>
            <FonteApiSettings 
              apiKeys={apiKeys} 
              updateApiKeys={updateApiKeys} 
            />

            <GoogleApiSettings 
              apiKeys={apiKeys} 
              updateApiKeys={updateApiKeys} 
            />
          </>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save All Settings</span>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;