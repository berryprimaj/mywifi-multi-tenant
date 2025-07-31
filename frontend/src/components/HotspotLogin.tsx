import React, { useState, useEffect } from 'react';
import { Wifi, MessageCircle, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams
import { useTenant } from '../contexts/TenantContext'; // Import useTenant

// Define a local type for Member to ensure we have all necessary fields
type Member = {
  id: number;
  username: string;
  name: string;
  department: string;
  password?: string;
  status: 'active' | 'inactive';
};

const HotspotLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { settings } = useSettings();
  const { activeTenantId, selectTenant } = useTenant(); // Get activeTenantId and selectTenant
  const [searchParams] = useSearchParams(); // Get URL search parameters

  // Effect to read tenantId from URL and set active tenant
  useEffect(() => {
    const tenantIdFromUrl = searchParams.get('tenantId');
    if (tenantIdFromUrl && tenantIdFromUrl !== activeTenantId) {
      selectTenant(tenantIdFromUrl);
    }
  }, [searchParams, activeTenantId, selectTenant]);

  // Effect to apply dark/light mode class to the html element for the hotspot login
  useEffect(() => {
    // Check if we're on hotspot route, if not, don't override admin theme
    if (window.location.pathname === '/' || window.location.pathname.startsWith('/hotspot')) {
      if (settings.themeMode === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('current-theme-mode', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('current-theme-mode', 'light');
      }
    }
  }, [settings.themeMode]);

  const handleWhatsAppLogin = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('OTP sent to WhatsApp!');
    setLoading(false);
  };

  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Retrieve members from local storage
      const storedMembers = localStorage.getItem('hotspot-members');
      const members: Member[] = storedMembers ? JSON.parse(storedMembers) : [];

      // Find the member by username
      const foundMember = members.find(member => member.username === username);

      // Check if member exists, password matches, and status is active
      if (foundMember && foundMember.password === password) {
        if (foundMember.status === 'active') {
          toast.success(`Login successful! Welcome, ${foundMember.name} from ${foundMember.department}`);
          // Here you would typically redirect or grant access
        } else {
          toast.error('Your account is inactive. Please contact admin.');
        }
      } else {
        toast.error('Login gagal, hubungi admin');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Determine background style based on settings and theme mode
  const backgroundStyle: React.CSSProperties = {
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundAttachment: 'fixed',
  };

  if (settings.backgroundImage) {
    backgroundStyle.backgroundImage = `url(${settings.backgroundImage})`;
  } else {
    if (settings.themeMode === 'dark') {
      // Use a default dark gradient for dark mode if no image
      backgroundStyle.backgroundImage = `linear-gradient(to bottom right, #1F2937, #111827)`; // Example dark gradient
    } else {
      // Use configured colors for light mode
      backgroundStyle.backgroundImage = `linear-gradient(to bottom right, ${settings.primaryColor}, ${settings.secondaryColor})`;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={backgroundStyle}>
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl text-gray-900 dark:text-gray-100">
        <div className="text-center mb-8">
          <div className="mb-6">
            {settings.logo ? (
              <img
                src={settings.logo}
                alt="Logo"
                className="h-32 w-auto mx-auto"
              />
            ) : (
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                <Wifi className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{settings.siteName}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{settings.welcomeMessage}</p>
        </div>

        {/* WhatsApp Login */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MessageCircle className="inline w-4 h-4 mr-2 text-green-600" />
            WhatsApp Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+62 812 3456 7890"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={handleWhatsAppLogin}
            disabled={loading || !phoneNumber}
            className="w-full mt-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            {loading ? 'Sending...' : 'Send OTP via WhatsApp'}
          </button>
        </div>

        <div className="flex items-center mb-6">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <span className="px-4 text-gray-500 dark:text-gray-400 text-sm">Or continue with</span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Google Login */}
        <a
          href="/auth/google"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center mb-6"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </a>

        {/* Member Login */}
        <div className="border-t border-gray-300 dark:border-gray-600 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">Member Login</h3>
          
          <form onSubmit={handleMemberLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter member username"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter member password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              <User className="w-5 h-5 mr-2" />
              {loading ? 'Signing in...' : 'Login as Member'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HotspotLogin;