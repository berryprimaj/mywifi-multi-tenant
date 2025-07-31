import React, { useState } from 'react';
import { Palette, Eye, Trash2, Sun, Moon } from 'lucide-react';
import { Settings } from '../../../contexts/SettingsContext';

interface HotspotAppearanceSettingsProps {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const HotspotAppearanceSettings: React.FC<HotspotAppearanceSettingsProps> = ({ settings, updateSettings }) => {
  // State lokal untuk mengontrol tema pratinjau
  const [previewThemeMode, setPreviewThemeMode] = useState<'light' | 'dark'>(settings.themeMode);

  const handleInputChange = (key: string, value: string) => {
    updateSettings({ [key]: value });
  };

  const handleFileChange = (key: 'logo' | 'backgroundImage', file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateSettings({ [key]: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    } else {
      updateSettings({ [key]: null });
    }
  };

  const hotspotBackgroundStyle = {
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundImage: settings.backgroundImage
      ? `url(${settings.backgroundImage})`
      : `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
  };

  // Fungsi untuk mengubah tema pratinjau
  const togglePreviewTheme = () => {
    setPreviewThemeMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-6">
        <Palette className="w-5 h-5 text-purple-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Hotspot Login Appearance</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleInputChange('siteName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Logo</label>
              {settings.logo && (
                <button type="button" onClick={() => handleFileChange('logo', null)} className="text-xs text-red-600 hover:underline font-medium flex items-center space-x-1">
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange('logo', e.target.files ? e.target.files[0] : null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Background Image</label>
              {settings.backgroundImage && (
                <button type="button" onClick={() => handleFileChange('backgroundImage', null)} className="text-xs text-red-600 hover:underline font-medium flex items-center space-x-1">
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange('backgroundImage', e.target.files ? e.target.files[0] : null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
            <textarea
              value={settings.welcomeMessage}
              onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Theme Mode for Hotspot Login */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme Mode</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="hotspotThemeMode"
                  value="light"
                  checked={settings.themeMode === 'light'}
                  onChange={() => updateSettings({ themeMode: 'light' })}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700 flex items-center"><Sun className="w-4 h-4 mr-1" /> Light</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="hotspotThemeMode"
                  value="dark"
                  checked={settings.themeMode === 'dark'}
                  onChange={() => updateSettings({ themeMode: 'dark' })}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700 flex items-center"><Moon className="w-4 h-4 mr-1" /> Dark</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className={`rounded-lg p-4 ${previewThemeMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-800'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Eye className="w-4 h-4 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Hotspot Login Preview</span>
            </div>
            <button 
              onClick={togglePreviewTheme}
              className="p-1.5 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
              title="Toggle Preview Theme"
            >
              {previewThemeMode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
          
          <div 
            className={`rounded-lg p-6 text-white min-h-[300px] flex items-center justify-center relative overflow-hidden ${previewThemeMode === 'dark' ? 'bg-gray-900' : ''}`}
            style={hotspotBackgroundStyle}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="text-center z-10">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                {settings.logo ? (
                  <img src={settings.logo} alt="Logo Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">📶</span>
                )}
              </div>
              <h2 className="text-2xl font-bold mb-2">{settings.siteName}</h2>
              <p className="text-white text-opacity-90">{settings.welcomeMessage}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotspotAppearanceSettings;