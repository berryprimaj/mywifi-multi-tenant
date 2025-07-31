import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Tenant } from '../types';
import tenantService, { TenantAPI } from '../services/tenantService';

interface TenantContextType {
  tenants: Tenant[];
  activeTenantId: string | null;
  loading: boolean;
  addTenant: (name: string, domain?: string, subdomain?: string) => Promise<void>;
  deleteTenant: (tenantId: string) => Promise<void>;
  selectTenant: (tenantId: string) => void;
  renameTenant: (tenantId: string, newName: string) => Promise<void>;
  getActiveTenant: () => Tenant | null;
  refreshTenants: () => Promise<void>;
  syncWithBackend: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

const defaultTenants: Tenant[] = [
  { id: 'default-tenant', name: 'Default Hotspot' },
];

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>(defaultTenants);
  const [loading, setLoading] = useState(false);
  const [activeTenantId, setActiveTenantId] = useState<string | null>(() => {
    try {
      const savedActiveTenantId = localStorage.getItem('active-tenant-id');
      return savedActiveTenantId || defaultTenants[0].id;
    } catch {
      return defaultTenants[0].id;
    }
  });

  // Convert TenantAPI to Tenant
  const convertApiToTenant = (apiTenant: TenantAPI): Tenant => ({
    id: apiTenant.id,
    name: apiTenant.name,
    domain: apiTenant.domain,
    subdomain: apiTenant.subdomain,
  });

  // Refresh tenants from backend
  const refreshTenants = useCallback(async () => {
    setLoading(true);
    try {
      const apiTenants = await tenantService.getTenants();
      const convertedTenants = apiTenants.map(convertApiToTenant);
      setTenants(convertedTenants);

      // Save to localStorage as backup
      localStorage.setItem('app-tenants', JSON.stringify(convertedTenants));
    } catch (error) {
      console.error('Failed to refresh tenants:', error);
      // Fallback to localStorage
      const savedTenants = localStorage.getItem('app-tenants');
      if (savedTenants) {
        setTenants(JSON.parse(savedTenants));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync with backend on mount
  const syncWithBackend = useCallback(async () => {
    try {
      // Try to resolve tenant by current domain
      const currentTenant = await tenantService.resolveCurrentTenant();
      if (currentTenant) {
        const convertedTenant = convertApiToTenant(currentTenant);
        setActiveTenantId(currentTenant.id);

        // Update tenants list if this tenant is not in the list
        setTenants(prev => {
          const exists = prev.some(t => t.id === currentTenant.id);
          if (!exists) {
            return [...prev, convertedTenant];
          }
          return prev;
        });
      }

      // Refresh all tenants
      await refreshTenants();
    } catch (error) {
      console.error('Failed to sync with backend:', error);
    }
  }, [refreshTenants]);

  useEffect(() => {
    if (activeTenantId) {
      localStorage.setItem('active-tenant-id', activeTenantId);
    } else {
      localStorage.removeItem('active-tenant-id');
    }
  }, [activeTenantId]);

  // Initial sync with backend
  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  const addTenant = useCallback(async (name: string, domain?: string, subdomain?: string) => {
    setLoading(true);
    try {
      const newTenant = await tenantService.createTenant({
        name,
        domain,
        subdomain,
      });

      const convertedTenant = convertApiToTenant(newTenant);
      setTenants((prev) => [...prev, convertedTenant]);

      // Refresh from database to ensure consistency
      await refreshTenants();

      toast.success(`Tenant '${name}' added successfully!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add tenant');
    } finally {
      setLoading(false);
    }
  }, [refreshTenants]);

  const deleteTenant = useCallback(async (tenantId: string) => {
    if (tenants.length === 1) {
      toast.error('Cannot delete the last tenant.');
      return;
    }

    setLoading(true);
    try {
      await tenantService.deleteTenant(tenantId);

      setTenants((prev) => {
        const updatedTenants = prev.filter((t) => t.id !== tenantId);
        if (activeTenantId === tenantId) {
          setActiveTenantId(updatedTenants[0]?.id || null);
        }
        return updatedTenants;
      });
      toast.success('Tenant deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete tenant');
    } finally {
      setLoading(false);
    }
  }, [tenants, activeTenantId]);

  const selectTenant = useCallback((tenantId: string) => {
    if (tenants.some(t => t.id === tenantId)) {
      setActiveTenantId(tenantId);
      toast.success(`Switched to tenant: ${tenants.find(t => t.id === tenantId)?.name}`);
    } else {
      toast.error('Tenant not found.');
    }
  }, [tenants]);

  const renameTenant = useCallback(async (tenantId: string, newName: string) => {
    setLoading(true);
    try {
      await tenantService.updateTenant(tenantId, { name: newName });

      setTenants(prev => prev.map(tenant =>
        tenant.id === tenantId ? { ...tenant, name: newName } : tenant
      ));
      toast.success(`Tenant name updated to '${newName}'!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update tenant name');
    } finally {
      setLoading(false);
    }
  }, []);

  const getActiveTenant = useCallback(() => {
    return tenants.find(t => t.id === activeTenantId) || null;
  }, [tenants, activeTenantId]);

  const value = {
    tenants,
    activeTenantId,
    loading,
    addTenant,
    deleteTenant,
    selectTenant,
    renameTenant,
    getActiveTenant,
    refreshTenants,
    syncWithBackend,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};