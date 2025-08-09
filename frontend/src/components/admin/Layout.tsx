import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Router, 
  Settings, 
  Shield, 
  User,
  LogOut,
  Search,
  Wifi,
  Building2, // New icon for Tenant Management
  Sun, // Icon for light mode
  Moon, // Icon for dark mode
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useTenant } from '../../contexts/TenantContext'; // Import useTenant
import { useEffect, useState } from 'react';
import NotificationDropdown from './NotificationDropdown';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { adminSettings, apiKeys, updateAdminSettings } = useSettings(); // Get apiKeys and updateAdminSettings
  const { tenants, activeTenantId, selectTenant, getActiveTenant } = useTenant(); // Get getActiveTenant
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Effect to apply dark/light mode class to the html element for the admin panel
  useEffect(() => {
    if (adminSettings.themeMode === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('current-theme-mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('current-theme-mode', 'light');
    }
  }, [adminSettings.themeMode]);

  // Effect to restore theme on component mount only (no state updates to prevent loops)
  useEffect(() => {
    const savedTheme = localStorage.getItem('current-theme-mode');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // If no saved theme, apply current adminSettings theme
      if (adminSettings.themeMode === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('current-theme-mode', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('current-theme-mode', 'light');
      }
    }
  }, []); // Run only on mount, no state updates

  // Effect to close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isNotificationOpen && !target.closest('.notification-dropdown')) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  // Define all possible menu items
  const allMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', roles: ['super_admin', 'administrator', 'moderator', 'viewer', 'owner', 'manager', 'staff'] },
    { icon: Users, label: 'Social Users', path: '/admin/social-users', roles: ['super_admin', 'administrator', 'moderator', 'owner', 'manager', 'staff'] },
    { icon: UserCheck, label: 'Members', path: '/admin/members', roles: ['super_admin', 'administrator', 'moderator', 'owner', 'manager', 'staff'] },
    { icon: Router, label: 'Router Config', path: '/admin/router-config', roles: ['super_admin', 'administrator'] },
    { icon: Settings, label: 'Settings', path: '/admin/settings', roles: ['super_admin', 'administrator', 'owner'] }, // Owner can edit tenant settings
    { icon: Shield, label: 'Permissions', path: '/admin/permissions', roles: ['super_admin', 'administrator', 'owner', 'manager'] }, // Manager can create staff roles
    { icon: User, label: 'Profile', path: '/admin/profile', roles: ['super_admin', 'administrator', 'moderator', 'viewer', 'owner', 'manager', 'staff'] },
    { icon: Building2, label: 'Tenant Management', path: '/admin/tenants', roles: ['super_admin'] }, // Only super_admin
  ];

  // Filter menu items based on user's role
  const menuItems = allMenuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const isActive = (path: string) => location.pathname === path;

  const formatRole = (role: string = '') => {
    return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const currentTenant = getActiveTenant(); // Get the active tenant object

  // Determine the status of the active tenant's MikroTik configuration
  // Note: This checks the current tenant's settings from SettingsContext
  // The apiKeys are already tenant-specific through SettingsContext
  const isMikrotikConfigured = 
    apiKeys.mikrotikHost &&
    apiKeys.mikrotikPort &&
    apiKeys.mikrotikUsername &&
    apiKeys.mikrotikPassword;

  const statusDotColor = isMikrotikConfigured ? 'bg-green-500' : 'bg-gray-400';
  const statusTooltip = isMikrotikConfigured ? 'MikroTik Configured' : 'MikroTik Not Configured';

  const toggleTheme = () => {
    updateAdminSettings({ themeMode: adminSettings.themeMode === 'light' ? 'dark' : 'light' });
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
              {adminSettings.logo ? (
                <img src={adminSettings.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Wifi className="w-5 h-5" />
              )}
            </div>
            <div>
              <h1 className="text-lg font-bold">{adminSettings.siteName}</h1>
              <p className="text-xs text-slate-400">{currentTenant ? `${currentTenant.name} Admin Panel` : 'Admin Panel'}</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{user ? formatRole(user.role) : 'User'}</p>
              <p className="text-xs text-slate-400">{user ? user.username : '...'}</p>
            </div>
          </div>
          {user?.role === 'super_admin' && ( // Only super_admin can change active tenant
            <div className="mt-4">
              <label htmlFor="tenant-select" className="block text-xs font-medium text-slate-400 mb-1">
                Active Tenant: 
                <span 
                  className={`inline-block w-2.5 h-2.5 rounded-full ml-2 ${statusDotColor} transition-colors duration-200`} 
                  title={`${statusTooltip} - ${currentTenant?.name || 'Unknown Tenant'}`}
                ></span>
              </label>
              <select
                id="tenant-select"
                value={activeTenantId || ''}
                onChange={(e) => selectTenant(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {tenants.map(tenant => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
              
              {/* Status indicator with more details */}
              <div className="mt-2 text-xs">
                <div className={`flex items-center space-x-2 ${isMikrotikConfigured ? 'text-green-400' : 'text-yellow-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${statusDotColor}`}></span>
                  <span>{isMikrotikConfigured ? 'MikroTik Ready' : 'MikroTik Not Configured'}</span>
                </div>
                {!isMikrotikConfigured && (
                  <p className="text-slate-500 mt-1 text-xs">
                    Configure MikroTik settings in Router Config
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Toggle Theme"
              >
                {adminSettings.themeMode === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <NotificationDropdown 
                isOpen={isNotificationOpen}
                onToggle={() => setIsNotificationOpen(!isNotificationOpen)}
              />
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{user ? formatRole(user.role) : 'User'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user ? user.username : '...'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-100 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;