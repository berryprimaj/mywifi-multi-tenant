import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTenant } from '../contexts/TenantContext'; // Import useTenant

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth(); // Get login function from useAuth
  const { adminSettings } = useSettings();
  const { selectTenant } = useTenant(); // Use selectTenant from TenantContext
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loggedInUser = await login(username, password); // login now returns the user object or null
      if (loggedInUser) {
        // After successful login, ensure the active tenant is set based on the user's tenantId
        if (loggedInUser.tenantId) {
          selectTenant(loggedInUser.tenantId);
        }
        navigate('/admin/dashboard');
      } else {
        // Error message is already handled by the login function via toast
        setError('Login failed. Please check your credentials.'); // Generic error for UI
      }
    } catch (err) {
      setError('Login failed. An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Determine background style based on adminSettings and theme mode
  const backgroundStyle: React.CSSProperties = {
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundAttachment: 'fixed',
  };

  if (adminSettings.backgroundImage) {
    backgroundStyle.backgroundImage = `url(${adminSettings.backgroundImage})`;
  } else {
    if (adminSettings.themeMode === 'dark') {
      // Use a default dark gradient for dark mode if no image
      backgroundStyle.backgroundImage = `linear-gradient(135deg, #1E3A8A, #111827)`; // Example dark gradient
    } else {
      // Use configured colors for light mode
      backgroundStyle.backgroundImage = `linear-gradient(135deg, ${adminSettings.primaryColor}, ${adminSettings.secondaryColor})`;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={backgroundStyle}>
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          {adminSettings.logo ? (
            <img src={adminSettings.logo} alt="Logo" className="h-24 w-auto mx-auto mb-4" />
          ) : (
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-slate-700 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-800">{adminSettings.siteName}</h1>
          <p className="text-gray-600 mt-2">{adminSettings.welcomeMessage}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
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
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
          >
            <Shield className="w-5 h-5 mr-2" />
            {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;