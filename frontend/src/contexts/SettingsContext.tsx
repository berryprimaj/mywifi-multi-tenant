import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useTenant } from './TenantContext'; // Import useTenant

interface Settings {
  siteName: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string | null;
  backgroundImage: string | null;
  welcomeMessage: string;
  themeMode: 'light' | 'dark'; // Added themeMode
}

export interface ApiKeys {
  fonteApiKey: string;
  fonteDeviceId: string;
  googleClientId: string;
  googleClientSecret: string;
  googleRedirectUri: string;
  mikrotikHost: string;
  mikrotikPort: string;
  mikrotikUsername: string;
  mikrotikPassword: string;
}

interface TenantSpecificSettings {
  hotspot: Settings;
  admin: Settings;
  apiKeys: ApiKeys;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  adminSettings: Settings;
  updateAdminSettings: (newSettings: Partial<Settings>) => void;
  apiKeys: ApiKeys;
  updateApiKeys: (newKeys: Partial<ApiKeys>) => void;
  fetchSettingsFromBackend: () => Promise<void>; // Renamed for clarity, now loads from localStorage
  saveSettingsToBackend: () => Promise<void>; // Renamed for clarity, now saves to localStorage
}

// Default values for initial state
const defaultHotspotSettings: Settings = {
  siteName: 'MyHotspot-WiFi',
  primaryColor: '#3B82F6',
  secondaryColor: '#8B5CF6',
  logo: null,
  backgroundImage: null,
  welcomeMessage: 'Welcome to MyHotspot Free WiFi',
  themeMode: 'light', // Default to light mode
};

const defaultAdminSettings: Settings = {
  siteName: 'MYHOTSPOT',
  primaryColor: '#1E3A8A',
  secondaryColor: '#475569',
  logo: null,
  backgroundImage: null,
  welcomeMessage: 'Administrator Panel',
  themeMode: 'light', // Default to light mode
};

const defaultApiKeys: ApiKeys = {
  fonteApiKey: '',
  fonteDeviceId: '',
  googleClientId: '',
  googleClientSecret: '',
  googleRedirectUri: 'https://yourdomain.com/auth/google/callback',
  mikrotikHost: '',
  mikrotikPort: '8728',
  mikrotikUsername: 'admin',
  mikrotikPassword: '',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Key for storing all tenant settings in localStorage
const LOCAL_STORAGE_SETTINGS_KEY = 'app-tenant-settings';

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { activeTenantId } = useTenant(); // Get activeTenantId from TenantContext

  const [settings, setSettings] = useState<Settings>(defaultHotspotSettings);
  const [adminSettings, setAdminSettings] = useState<Settings>(defaultAdminSettings);
  const [apiKeys, setApiKeys] = useState<ApiKeys>(defaultApiKeys);

  // Function to save current settings for the active tenant to localStorage
  // Added showToast parameter to control toast display for initial saves
  const saveCurrentTenantSettings = useCallback(async (
    hotspotSettingsToSave: Settings,
    adminSettingsToSave: Settings,
    apiKeysToSave: ApiKeys,
    showToast: boolean = true
  ) => {
    if (!activeTenantId) {
      if (showToast) toast.error('No active tenant selected. Cannot save settings.');
      return;
    }

    try {
      const allTenantSettingsString = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      const allTenantSettings: { [key: string]: TenantSpecificSettings } = allTenantSettingsString ? JSON.parse(allTenantSettingsString) : {};
      
      allTenantSettings[activeTenantId] = {
        hotspot: hotspotSettingsToSave,
        admin: adminSettingsToSave,
        apiKeys: apiKeysToSave,
      };

      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(allTenantSettings));
      
      // *** NEW: Update the state variables directly after saving to localStorage ***
      setSettings(hotspotSettingsToSave);
      setAdminSettings(adminSettingsToSave);
      setApiKeys(apiKeysToSave);

      if (showToast) toast.success(`Settings saved for tenant: ${activeTenantId}!`);
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
      if (showToast) toast.error('Failed to save settings.');
    }
  }, [activeTenantId]);

  // Function to load settings for the active tenant from localStorage
  const loadTenantSettings = useCallback(async () => {
    if (!activeTenantId) {
      console.warn('No active tenant selected. Cannot load settings.');
      setSettings(defaultHotspotSettings);
      setAdminSettings(defaultAdminSettings);
      setApiKeys(defaultApiKeys);
      return;
    }

    try {
      const allTenantSettingsString = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      const allTenantSettings: { [key: string]: TenantSpecificSettings } = allTenantSettingsString ? JSON.parse(allTenantSettingsString) : {};

      const currentTenantSettings = allTenantSettings[activeTenantId];

      if (currentTenantSettings) {
        // Merge with defaults to ensure new properties are present
        setSettings({ ...defaultHotspotSettings, ...currentTenantSettings.hotspot });
        setAdminSettings({ ...defaultAdminSettings, ...currentTenantSettings.admin });
        setApiKeys({ ...defaultApiKeys, ...currentTenantSettings.apiKeys });
      } else {
        // If no settings found for this tenant, use defaults
        setSettings(defaultHotspotSettings);
        setAdminSettings(defaultAdminSettings);
        setApiKeys(defaultApiKeys);
        await saveCurrentTenantSettings(defaultHotspotSettings, defaultAdminSettings, defaultApiKeys, false); // Suppress toast
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
      toast.error(`Failed to load settings for tenant ${activeTenantId}. Using default values.`);
      setSettings(defaultHotspotSettings);
      setAdminSettings(defaultAdminSettings);
      setApiKeys(defaultApiKeys);
    }
  }, [activeTenantId, saveCurrentTenantSettings]); // Removed adminSettings.themeMode to prevent loops

  // Effect to load settings when activeTenantId changes
  useEffect(() => {
    loadTenantSettings();
  }, [activeTenantId, loadTenantSettings]); // Changed dependency array to explicitly include activeTenantId

  // Removed the useEffect that automatically saves on state changes.
  // Settings will now only be saved when saveSettingsToBackend is explicitly called.

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prevSettings => ({ ...prevSettings, ...newSettings }));
  };

  const updateAdminSettings = (newSettings: Partial<Settings>) => {
    setAdminSettings(prevSettings => ({ ...prevSettings, ...newSettings }));
  };

  const updateApiKeys = (newKeys: Partial<ApiKeys>) => {
    setApiKeys(prevKeys => ({ ...prevKeys, ...newKeys }));
  };

  const value = { 
    settings, 
    updateSettings, 
    adminSettings, 
    updateAdminSettings,
    apiKeys,
    updateApiKeys,
    fetchSettingsFromBackend: loadTenantSettings, // Renamed for clarity
    saveSettingsToBackend: () => saveCurrentTenantSettings(settings, adminSettings, apiKeys) // Renamed for clarity
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};