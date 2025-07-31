import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import HotspotLogin from './components/HotspotLogin';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import SocialUsers from './components/admin/SocialUsers';
import Members from './components/admin/Members';
import RouterConfig from './components/admin/RouterConfig';
import Settings from './components/admin/Settings';
import Permissions from './components/admin/Permissions';
import Profile from './components/admin/Profile';
import TenantManagement from './pages/admin/TenantManagement'; // Import new TenantManagement page
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { TenantProvider } from './contexts/TenantContext'; // Import TenantProvider
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  // Restore theme immediately on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem('current-theme-mode');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  return (
    <AuthProvider>
      <TenantProvider> {/* TenantProvider wraps SettingsProvider */}
        <SettingsProvider>
          <Router>
            <div className="min-h-screen">
              <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                  // Default options for all toasts
                  duration: 4000,
                  style: {
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-text)',
                    border: '1px solid var(--toast-border)',
                  },
                  // Success toast styling
                  success: {
                    style: {
                      background: 'var(--toast-bg)',
                      color: 'var(--toast-text)',
                      border: '1px solid var(--toast-border)',
                    },
                  },
                  // Error toast styling
                  error: {
                    style: {
                      background: 'var(--toast-bg)',
                      color: 'var(--toast-text)',
                      border: '1px solid var(--toast-border)',
                    },
                  },
                }}
              />
              <Routes>
                <Route path="/" element={<HotspotLogin />} />
                <Route path="/admin" element={<AdminLogin />} />
                
                {/* Rute Admin yang Dilindungi */}
                <Route 
                  path="/admin/dashboard" 
                  element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} 
                />
                <Route 
                  path="/admin/social-users" 
                  element={<ProtectedRoute><SocialUsers /></ProtectedRoute>} 
                />
                <Route 
                  path="/admin/members" 
                  element={<ProtectedRoute><Members /></ProtectedRoute>} 
                />
                <Route 
                  path="/admin/router-config" 
                  element={<ProtectedRoute><RouterConfig /></ProtectedRoute>} 
                />
                <Route 
                  path="/admin/settings" 
                  element={<ProtectedRoute><Settings /></ProtectedRoute>} 
                />
                <Route 
                  path="/admin/permissions" 
                  element={<ProtectedRoute><Permissions /></ProtectedRoute>} 
                />
                <Route 
                  path="/admin/profile" 
                  element={<ProtectedRoute><Profile /></ProtectedRoute>} 
                />
                <Route 
                  path="/admin/tenants" 
                  element={<ProtectedRoute><TenantManagement /></ProtectedRoute>} 
                /> {/* New Tenant Management Route */}
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </SettingsProvider>
      </TenantProvider>
    </AuthProvider>
  );
}

export default App;