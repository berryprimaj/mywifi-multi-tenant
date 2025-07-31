export interface Tenant {
  id: string;
  name: string;
  domain?: string; // Added optional domain property
}

export type Role = {
  id: string;
  name: string;
  value: 'super_admin' | 'administrator' | 'moderator' | 'viewer' | 'owner' | 'manager' | 'staff'; // Added new roles
  permissions: string[];
  description: string;
  color: string;
  passwordExpiryDays: number | null;
  tenantId?: string; // Optional: to indicate if this role is tenant-specific
};