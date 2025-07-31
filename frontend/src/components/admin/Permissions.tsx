import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Key } from 'lucide-react';
import Layout from './Layout';
import toast from 'react-hot-toast';
import { useAuth, Admin } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { Role } from '../../types';

// Import new modular components
import AddAdministratorForm from './permissions/AddAdministratorForm';
import GlobalPasswordSettingsModal from './permissions/GlobalPasswordSettingsModal';
import RolesList from './permissions/RolesList';
import AdministratorsList from './permissions/AdministratorsList';
import RoleModals from './permissions/RoleModals';
import AdminModals from './permissions/AdminModals';

const defaultRoles: Role[] = [
  { id: 'role-super-admin', name: 'Super Administrator', value: 'super_admin', permissions: ['*'], description: 'Full system access', color: 'bg-red-100 text-red-800', passwordExpiryDays: null },
  { id: 'role-administrator', name: 'Administrator', value: 'administrator', permissions: ['users.view', 'users.create', 'users.edit', 'settings.view', 'settings.edit', 'permissions.view', 'permissions.edit'], description: 'Manage users and basic settings', color: 'bg-blue-100 text-blue-800', passwordExpiryDays: 90 },
  { id: 'role-moderator', name: 'Moderator', value: 'moderator', permissions: ['users.view', 'users.edit', 'reports.view'], description: 'View and moderate users', color: 'bg-green-100 text-green-800', passwordExpiryDays: 90 },
  { id: 'role-viewer', name: 'Viewer', value: 'viewer', permissions: ['users.view', 'reports.view'], description: 'Read-only access', color: 'bg-gray-100 text-gray-800', passwordExpiryDays: 180 },
  // New Tenant-Specific Roles
  { id: 'role-owner', name: 'Tenant Owner', value: 'owner', permissions: ['dashboard.view', 'social_users.view', 'social_users.edit', 'members.view', 'members.create', 'members.edit', 'members.delete', 'profile.view', 'profile.edit', 'tenant_roles.manage', 'tenant_settings.edit'], description: 'Full control over a specific tenant, including managing tenant-specific roles and settings.', color: 'bg-yellow-100 text-yellow-800', passwordExpiryDays: null },
  { id: 'role-manager', name: 'Tenant Manager', value: 'manager', permissions: ['dashboard.view', 'social_users.view', 'social_users.edit', 'members.view', 'members.create', 'members.edit', 'members.delete', 'profile.view', 'profile.edit', 'tenant_roles.create_staff'], description: 'Manage users and basic settings for a specific tenant, can create staff roles.', color: 'bg-orange-100 text-orange-800', passwordExpiryDays: 90 },
  { id: 'role-staff', name: 'Tenant Staff', value: 'staff', permissions: ['dashboard.view', 'social_users.view', 'members.view', 'profile.view'], description: 'View-only access for a specific tenant, can manage members.', color: 'bg-teal-100 text-teal-800', passwordExpiryDays: 90 }
];

const Permissions = () => {
  const { user, admins, addAdmin, updateUser, deleteAdmin } = useAuth();
  const { activeTenantId, tenants } = useTenant();

  // State for forms and modals
  const [showAddForm, setShowAddForm] = useState(false);
  const [showGlobalPasswordSettingsModal, setShowGlobalPasswordSettingsModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState<{ username: string; email: string; password: string; role: Role['value']; tenantId: string }>({ username: '', email: '', password: '', role: 'administrator', tenantId: activeTenantId || 'default-tenant' });

  // State for Role Modals
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [isDeleteRoleModalOpen, setIsDeleteRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editedRole, setEditedRole] = useState<Role | null>(null);

  // State for Admin Modals
  const [isViewAdminModalOpen, setIsViewAdminModalOpen] = useState(false);
  const [isEditAdminModalOpen, setIsEditAdminModalOpen] = useState(false);
  const [isDeleteAdminModalOpen, setIsDeleteAdminModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [editedAdmin, setEditedAdmin] = useState<Admin | null>(null);

  // State for global password settings
  const [passwordSettings, setPasswordSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('global-password-settings');
      return savedSettings ? JSON.parse(savedSettings) : {
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSymbols: false,
        lockoutAttempts: 5,
      };
    } catch {
      return {
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSymbols: false,
        lockoutAttempts: 5,
      };
    }
  });

  // State for roles, loaded from localStorage or default
  const [roles, setRoles] = useState<Role[]>(() => {
    try {
      const savedRoles = localStorage.getItem('app-roles');
      const parsedRoles = savedRoles ? JSON.parse(savedRoles) : [];
      const combinedRoles = defaultRoles.map(defaultRole => {
        const existingRole = parsedRoles.find((r: Role) => r.id === defaultRole.id);
        return existingRole ? { ...defaultRole, ...existingRole } : defaultRole;
      });
      const customRoles = parsedRoles.filter((r: Role) => !defaultRoles.some(dr => dr.id === r.id));
      return [...combinedRoles, ...customRoles];
    } catch (error) {
      console.error("Could not parse roles from localStorage", error);
      return defaultRoles;
    }
  });

  // Persist global password settings
  useEffect(() => {
    localStorage.setItem('global-password-settings', JSON.stringify(passwordSettings));
  }, [passwordSettings]);

  // Persist roles
  useEffect(() => {
    localStorage.setItem('app-roles', JSON.stringify(roles));
  }, [roles]);

  // Handlers for Roles
  const handleEditRole = useCallback((roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setSelectedRole(role);
      setEditedRole({ ...role });
      setIsEditRoleModalOpen(true);
    }
  }, [roles]);

  const handleDeleteRole = useCallback((roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      if (role.value === 'super_admin' || role.value === 'administrator' || role.value === 'moderator' || role.value === 'viewer' || role.value === 'owner' || role.value === 'manager' || role.value === 'staff') {
        toast.error(`Cannot delete default role '${role.name}'.`);
        return;
      }
      if (admins.some(admin => admin.role === role.value)) {
        toast.error(`Cannot delete role '${role.name}' because it is assigned to existing administrators.`);
        return;
      }
      setSelectedRole(role);
      setIsDeleteRoleModalOpen(true);
    }
  }, [admins, roles]);

  const confirmEditRole = useCallback(() => {
    if (editedRole) {
      setRoles(prevRoles => prevRoles.map(r => r.id === editedRole.id ? editedRole : r));
      toast.success(`Role ${editedRole.name} updated successfully!`);
      setIsEditRoleModalOpen(false);
      setEditedRole(null);
    }
  }, [editedRole]);

  const confirmDeleteRole = useCallback(() => {
    if (selectedRole) {
      setRoles(prevRoles => prevRoles.filter(r => r.id !== selectedRole.id));
      toast.success(`Role ${selectedRole.name} deleted successfully!`);
      setIsDeleteRoleModalOpen(false);
      setSelectedRole(null);
    }
  }, [selectedRole]);

  const handleEditRoleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (editedRole) {
      const { name, value } = e.target;
      // Check if the target is an HTMLInputElement and has a 'checked' property (for checkboxes)
      if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
        setEditedRole(prev => ({
          ...prev!,
          [name]: (e.target as HTMLInputElement).checked, // Cast to HTMLInputElement to access 'checked'
        }));
      } else {
        setEditedRole(prev => ({
          ...prev!,
          [name]: value,
        }));
      }
    }
  }, [editedRole]);

  // Handlers for Admins
  const handleViewAdmin = useCallback((admin: Admin) => {
    setSelectedAdmin(admin);
    setIsViewAdminModalOpen(true);
  }, []);

  const handleEditAdmin = useCallback((admin: Admin) => {
    if (admin.role === 'super_admin') {
      toast.error('Super Administrator cannot be edited.');
      return;
    }
    setEditedAdmin({ ...admin });
    setIsEditAdminModalOpen(true);
  }, []);

  const handleDeleteAdmin = useCallback((admin: Admin) => {
    if (admin.role === 'super_admin') {
      toast.error('Super Administrator cannot be deleted.');
      return;
    }
    if (user?.id === admin.id) {
      toast.error("You cannot delete your own account.");
      return;
    }
    setSelectedAdmin(admin);
    setIsDeleteAdminModalOpen(true);
  }, [user]);

  const confirmEditAdmin = useCallback(() => {
    if (editedAdmin) {
      updateUser(editedAdmin.id, editedAdmin);
      toast.success(`Administrator ${editedAdmin.username} updated successfully!`);
      setIsEditAdminModalOpen(false);
      setEditedAdmin(null);
    }
  }, [editedAdmin, updateUser]);

  const confirmDeleteAdmin = useCallback(() => {
    if (selectedAdmin) {
      deleteAdmin(selectedAdmin.id);
      toast.success(`Administrator ${selectedAdmin.username} deleted successfully!`);
      setIsDeleteAdminModalOpen(false);
      setSelectedAdmin(null);
    }
  }, [selectedAdmin, deleteAdmin]);

  const handleEditAdminFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editedAdmin) {
      const { name, value } = e.target;
      setEditedAdmin({
        ...editedAdmin,
        [name]: value,
      });
    }
  }, [editedAdmin]);

  // Handlers for Add Admin Form
  const handleAddAdmin = useCallback(() => {
    if (!newAdmin.username || !newAdmin.email || !newAdmin.password) {
      toast.error('Please fill all required fields including password.');
      return;
    }

    // Determine the hierarchy of roles for permission checks
    const roleHierarchy: Record<Role['value'], number> = {
      'super_admin': 5, // Highest
      'administrator': 4,
      'owner': 3, // Tenant owner is below global admin
      'manager': 2,
      'moderator': 2, // Moderator and manager are at similar levels for different scopes
      'staff': 1,
      'viewer': 1, // Viewer and staff are at similar levels for different scopes
    };

    const currentUserRoleLevel = user ? roleHierarchy[user.role] : 0;
    const newAdminRoleLevel = roleHierarchy[newAdmin.role];

    if (user?.role === 'super_admin') {
      // Super admin can add any role
      addAdmin(newAdmin);
      toast.success('New administrator added successfully!');
      setNewAdmin({ username: '', email: '', password: '', role: 'administrator', tenantId: activeTenantId || 'default-tenant' });
      setShowAddForm(false);
    } else if (user?.role === 'owner' || user?.role === 'manager') {
      // Tenant owner/manager can only add roles with a lower hierarchy level within their tenant
      if (newAdminRoleLevel < currentUserRoleLevel) {
        // Ensure the new admin is assigned to the current active tenant
        const adminToAdd = { ...newAdmin, tenantId: activeTenantId || 'default-tenant' };
        addAdmin(adminToAdd);
        toast.success('New administrator added successfully!');
        setNewAdmin({ username: '', email: '', password: '', role: 'staff', tenantId: activeTenantId || 'default-tenant' }); // Default to staff for tenant admins
        setShowAddForm(false);
      } else {
        toast.error('You can only add users with a lower role than your own within your tenant.');
      }
    } else {
      toast.error('You do not have permission to add administrators.');
    }
  }, [newAdmin, addAdmin, activeTenantId, user?.role, user]);

  // Handlers for Global Password Settings
  const handlePasswordSettingsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPasswordSettings((prev: typeof passwordSettings) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value),
    }));
  }, []);

  const handleSavePasswordSettings = useCallback(() => {
    console.log('Saving global password settings:', passwordSettings);
    toast.success('Global password settings saved successfully!');
    setShowGlobalPasswordSettingsModal(false);
  }, [passwordSettings]);

  // Helper to get tenant name from ID
  const getTenantName = useCallback((tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : 'Unknown Tenant';
  }, [tenants]);

  // Filter admins based on user role and active tenant
  const filteredAdmins = user?.role === 'super_admin'
    ? admins
    : admins.filter(admin => admin.tenantId === activeTenantId);

  // Filter roles displayed in the RolesList based on user role
  const rolesForDisplay = roles.filter(role => {
    if (user?.role === 'super_admin') {
      return true; // Super admin sees all roles
    } else if (user?.role === 'owner' || user?.role === 'manager') {
      // Tenant owner/manager only sees tenant-specific roles (owner, manager, staff)
      // and potentially custom roles they created (if we implement that later)
      return ['owner', 'manager', 'staff'].includes(role.value);
    }
    return false; // Other roles don't see this section
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Roles & Permissions</h1>
            <p className="text-gray-600">Manage administrator roles and permissions</p>
          </div>
          {(user?.role === 'super_admin' || user?.role === 'administrator' || user?.role === 'owner' || user?.role === 'manager') && ( // Allow administrators, owners, managers to see these buttons
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              {user?.role === 'super_admin' && ( // Only super_admin can see this button
                <button
                  onClick={() => setShowGlobalPasswordSettingsModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                >
                  <Key className="w-4 h-4" />
                  <span>Password Settings</span>
                </button>
              )}
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>
          )}
        </div>

        {(user?.role === 'super_admin' || user?.role === 'administrator' || user?.role === 'owner' || user?.role === 'manager') && ( // Allow administrators, owners, managers to see this form
          <AddAdministratorForm
            isOpen={showAddForm}
            onClose={() => setShowAddForm(false)}
            newAdmin={newAdmin}
            setNewAdmin={setNewAdmin}
            onAddAdmin={handleAddAdmin}
            roles={roles.filter(role => {
              if (user?.role === 'super_admin') {
                return true; // Super admin can assign any role
              } else if (user?.role === 'owner') {
                return ['manager', 'staff'].includes(role.value); // Owner can assign manager or staff
              } else if (user?.role === 'manager') {
                return role.value === 'staff'; // Manager can only assign staff
              }
              return false; // Other roles cannot add
            })}
            tenants={tenants}
            currentUserRole={user?.role}
            activeTenantId={activeTenantId}
          />
        )}

        {user?.role === 'super_admin' && (
          <GlobalPasswordSettingsModal
            isOpen={showGlobalPasswordSettingsModal}
            onClose={() => setShowGlobalPasswordSettingsModal(false)}
            passwordSettings={passwordSettings}
            onPasswordSettingsChange={handlePasswordSettingsChange}
            onSavePasswordSettings={handleSavePasswordSettings}
          />
        )}

        <RolesList
          roles={rolesForDisplay} // Use filtered roles for display
          admins={admins}
          onEditRole={handleEditRole}
          onDeleteRole={handleDeleteRole}
          currentUserRole={user?.role}
        />

        <AdministratorsList
          admins={filteredAdmins}
          onViewAdmin={handleViewAdmin}
          onEditAdmin={handleEditAdmin}
          onDeleteAdmin={handleDeleteAdmin}
          currentUserRole={user?.role}
          getTenantName={getTenantName}
        />
      </div>

      <RoleModals
        isEditModalOpen={isEditRoleModalOpen}
        setIsEditModalOpen={setIsEditRoleModalOpen} // Corrected prop name
        isDeleteModalOpen={isDeleteRoleModalOpen}
        setIsDeleteModalOpen={setIsDeleteRoleModalOpen}
        selectedRole={selectedRole}
        editedRole={editedRole}
        setEditedRole={setEditedRole}
        onConfirmEditRole={confirmEditRole}
        onConfirmDeleteRole={confirmDeleteRole}
        onEditRoleFormChange={handleEditRoleFormChange}
      />

      <AdminModals
        isViewModalOpen={isViewAdminModalOpen}
        setIsViewModalOpen={setIsViewAdminModalOpen} // Corrected prop name
        isEditModalOpen={isEditAdminModalOpen}
        setIsEditModalOpen={setIsEditAdminModalOpen}
        isDeleteModalOpen={isDeleteAdminModalOpen}
        setIsDeleteModalOpen={setIsDeleteAdminModalOpen}
        selectedAdmin={selectedAdmin}
        editedAdmin={editedAdmin}
        setEditedAdmin={setEditedAdmin}
        onConfirmEditAdmin={confirmEditAdmin}
        onConfirmDeleteAdmin={confirmDeleteAdmin}
        onEditAdminFormChange={handleEditAdminFormChange}
        getTenantName={getTenantName}
        roles={roles.filter(role => { // Filter roles for AdminModals as well
          if (user?.role === 'super_admin') {
            return true;
          } else if (user?.role === 'owner') {
            return ['manager', 'staff'].includes(role.value);
          } else if (user?.role === 'manager') {
            return role.value === 'staff';
          }
          return false;
        })}
        tenants={tenants}
      />
    </Layout>
  );
};

export default Permissions;