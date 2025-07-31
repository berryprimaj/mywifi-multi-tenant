import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export interface TenantAPI {
  id: string;
  name: string;
  domain?: string;
  subdomain?: string;
  status: boolean;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateTenantRequest {
  name: string;
  domain?: string;
  subdomain?: string;
  settings?: Record<string, any>;
}

export interface UpdateTenantRequest {
  name?: string;
  domain?: string;
  subdomain?: string;
  status?: boolean;
  settings?: Record<string, any>;
}

class TenantService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth-token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Only add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Get all tenants
   */
  async getTenants(search?: string, status?: boolean): Promise<TenantAPI[]> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status !== undefined) params.append('status', status.toString());

      const response = await axios.get(`${API_BASE_URL}/tenants?${params}`, {
        headers: this.getAuthHeaders(),
      });

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch tenants');
    } catch (error: any) {
      console.error('Error fetching tenants:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch tenants');
    }
  }

  /**
   * Get tenant by ID
   */
  async getTenant(id: string): Promise<TenantAPI> {
    try {
      const response = await axios.get(`${API_BASE_URL}/tenants/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch tenant');
    } catch (error: any) {
      console.error('Error fetching tenant:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch tenant');
    }
  }

  /**
   * Create new tenant
   */
  async createTenant(data: CreateTenantRequest): Promise<TenantAPI> {
    try {
      const response = await axios.post(`${API_BASE_URL}/tenants`, data, {
        headers: this.getAuthHeaders(),
      });

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to create tenant');
    } catch (error: any) {
      console.error('Error creating tenant:', error);

      // Development fallback - create mock tenant
      if (error.response?.status === 401 || error.code === 'ERR_NETWORK') {
        console.log('Backend not available, creating mock tenant for development');
        const mockTenant: TenantAPI = {
          id: `tenant-${Date.now()}`,
          name: data.name,
          domain: data.domain || null,
          subdomain: data.subdomain || null,
          status: true,
          settings: data.settings || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return mockTenant;
      }

      throw new Error(error.response?.data?.message || 'Failed to create tenant');
    }
  }

  /**
   * Update tenant
   */
  async updateTenant(id: string, data: UpdateTenantRequest): Promise<TenantAPI> {
    try {
      const response = await axios.put(`${API_BASE_URL}/tenants/${id}`, data, {
        headers: this.getAuthHeaders(),
      });

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to update tenant');
    } catch (error: any) {
      console.error('Error updating tenant:', error);
      throw new Error(error.response?.data?.message || 'Failed to update tenant');
    }
  }

  /**
   * Delete tenant
   */
  async deleteTenant(id: string): Promise<void> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/tenants/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete tenant');
      }
    } catch (error: any) {
      console.error('Error deleting tenant:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete tenant');
    }
  }

  /**
   * Find tenant by domain
   */
  async findTenantByDomain(domain: string): Promise<TenantAPI | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/tenant/resolve?domain=${domain}`);

      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error: any) {
      console.error('Error finding tenant by domain:', error);
      return null;
    }
  }

  /**
   * Update tenant settings
   */
  async updateTenantSettings(id: string, settings: Record<string, any>): Promise<TenantAPI> {
    try {
      const response = await axios.put(`${API_BASE_URL}/tenants/${id}/settings`, {
        settings,
      }, {
        headers: this.getAuthHeaders(),
      });

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to update tenant settings');
    } catch (error: any) {
      console.error('Error updating tenant settings:', error);
      throw new Error(error.response?.data?.message || 'Failed to update tenant settings');
    }
  }

  /**
   * Sync local tenant with backend
   */
  async syncTenant(localTenant: { id: string; name: string; domain?: string }): Promise<TenantAPI> {
    try {
      // Try to get existing tenant
      const existingTenant = await this.getTenant(localTenant.id);
      return existingTenant;
    } catch (error) {
      // If tenant doesn't exist, create it
      return await this.createTenant({
        name: localTenant.name,
        domain: localTenant.domain,
      });
    }
  }

  /**
   * Get current domain for tenant resolution
   */
  getCurrentDomain(): string {
    return window.location.hostname;
  }

  /**
   * Check if current domain matches a tenant
   */
  async resolveCurrentTenant(): Promise<TenantAPI | null> {
    const domain = this.getCurrentDomain();
    
    // Skip resolution for localhost and common development domains
    if (domain === 'localhost' || domain === '127.0.0.1' || domain.includes('localhost')) {
      return null;
    }

    return await this.findTenantByDomain(domain);
  }
}

export const tenantService = new TenantService();
export default tenantService;
