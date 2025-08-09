import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import authService from '../services/authService';

// Represents the currently logged-in user (without password)
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'administrator' | 'moderator' | 'viewer' | 'owner' | 'manager' | 'staff';
  permissions: string[];
  tenantId: string; // Added tenantId
}

// Represents an admin user in our system (with password for login check)
export interface Admin extends User {
  password?: string;
}

interface AuthContextType {
  user: User | null;
  admins: Admin[]; // Local admin management
  login: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
  addAdmin: (admin: Omit<Admin, 'id' | 'permissions'>) => void;
  updateUser: (userId: string, updates: Partial<Admin>) => void;
  deleteAdmin: (userId: string) => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  resetAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Default admin for initial setup
const defaultAdmins: Admin[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin', // This is the default password
    role: 'super_admin',
    permissions: ['*'],
    tenantId: 'default-tenant'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('auth-user-session');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error parsing user session from localStorage:", error);
      return null;
    }
  });

  const [admins, setAdmins] = useState<Admin[]>(() => {
    try {
      const savedAdmins = localStorage.getItem('auth-admins');
      const parsedAdmins = savedAdmins ? JSON.parse(savedAdmins) : [];
      // Ensure defaultAdmins are always present and take precedence for their IDs
      const combinedAdmins = [
        ...defaultAdmins,
        ...parsedAdmins.filter((a: Admin) => !defaultAdmins.some(da => da.id === a.id))
      ];
      return combinedAdmins.map((admin: Admin) => ({
        ...admin,
        tenantId: admin.tenantId || 'default-tenant'
      }));
    } catch (error) {
      console.error("Error initializing admins from localStorage:", error);
      return defaultAdmins;
    }
  });

  // Local authentication session management
  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('auth-user-session');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUser(user);
      } catch (error) {
        console.error('Error parsing saved user session:', error);
        localStorage.removeItem('auth-user-session');
      }
    }
  }, []);

  // Effect to persist the list of admins (still using localStorage for this list for now)
  useEffect(() => {
    localStorage.setItem('auth-admins', JSON.stringify(admins));
  }, [admins]);

  // Auto-login to backend if user session exists but no backend token
  useEffect(() => {
    const tryBackendLogin = async () => {
      const savedUser = localStorage.getItem('auth-user-session');
      const existingToken = localStorage.getItem('auth-token');

      if (savedUser && !existingToken) {
        try {
          const userData = JSON.parse(savedUser);
          // Try to login to backend with saved credentials
          const foundAdmin = admins.find(admin => admin.username === userData.username);
          if (foundAdmin) {
            await authService.login({
              username: foundAdmin.username,
              password: foundAdmin.password
            });
            console.log('Auto-login to backend successful');
          }
        } catch (error) {
          console.log('Auto-login to backend failed:', error);
        }
      }
    };

    if (user) {
      tryBackendLogin();
    }
  }, [user, admins]);

  const login = async (username: string, password: string): Promise<User | null> => {
    try {
      // Try backend login first
      const backendResponse = await authService.login({ username, password });

      if (backendResponse.success) {
        const loggedInUser: User = {
          id: backendResponse.data.user.id,
          username: backendResponse.data.user.username,
          email: backendResponse.data.user.email,
          role: backendResponse.data.user.role,
          permissions: backendResponse.data.user.permissions,
          tenantId: backendResponse.data.user.tenant_id,
        };
        setUser(loggedInUser);
        localStorage.setItem('auth-user-session', JSON.stringify(loggedInUser));
        toast.success('Logged in successfully!');
        return loggedInUser;
      }
    } catch (error) {
      console.log('Backend login failed, trying local fallback...');
    }

    // Fallback to local storage
    const foundAdmin = admins.find(
      (admin) => admin.username === username && admin.password === password
    );

    if (foundAdmin) {
      const loggedInUser: User = {
        id: foundAdmin.id,
        username: foundAdmin.username,
        email: foundAdmin.email,
        role: foundAdmin.role,
        permissions: foundAdmin.permissions,
        tenantId: foundAdmin.tenantId,
      };
      setUser(loggedInUser);
      localStorage.setItem('auth-user-session', JSON.stringify(loggedInUser));
      toast.success('Logged in successfully (local account)!');
      return loggedInUser;
    } else {
      toast.error('Invalid username or password.');
      return null;
    }
  };

  const logout = async () => {
    try {
      // Try backend logout first
      await authService.logout();
    } catch (error) {
      console.log('Backend logout failed');
    }

    // Clear local session
    setUser(null);
    localStorage.removeItem('auth-user-session');
    toast.success('Logged out successfully!');
  };

  // These functions operate on the local 'admins' state for now
  const addAdmin = useCallback((adminData: Omit<Admin, 'id' | 'permissions'>) => {
    const newAdmin: Admin = {
      id: Date.now().toString(), // Temporary ID
      ...adminData,
      permissions: [],
      tenantId: adminData.tenantId || 'default-tenant',
    };
    setAdmins((prevAdmins) => [...prevAdmins, newAdmin]);
    toast.success('New administrator added successfully!');
  }, []);

  const updateUser = useCallback((userId: string, updates: Partial<Admin>) => {
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) =>
        admin.id === userId ? { ...admin, ...updates } : admin
      )
    );
    toast.success('User updated successfully!');
  }, []);

  const deleteAdmin = useCallback((userId: string) => {
    setAdmins(prevAdmins => prevAdmins.filter(admin => admin.id !== userId));
    toast.success('Administrator deleted successfully!');
  }, []);

  const resetAuth = useCallback(() => {
    localStorage.removeItem('auth-user-session'); // Clear user session
    localStorage.removeItem('auth-admins');
    setUser(null);
    setAdmins(defaultAdmins);
    toast.success('Akun telah direset ke default (admin/admin).');
  }, []);

  const hasPermission = useCallback((permission: string) => {
    if (!user) return false;
    return user.permissions.includes('*') || user.permissions.includes(permission);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      admins,
      login,
      logout,
      addAdmin,
      updateUser,
      deleteAdmin,
      isAuthenticated: !!user,
      hasPermission,
      resetAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};