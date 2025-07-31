import React from 'react';
import { X } from 'lucide-react';
import { Role } from '../../../types';
import { Tenant } from '../../../types';
import { User } from '../../../contexts/AuthContext';

interface AddAdministratorFormProps {
  isOpen: boolean;
  onClose: () => void;
  newAdmin: { username: string; email: string; password: string; role: Role['value']; tenantId: string };
  setNewAdmin: React.Dispatch<React.SetStateAction<{ username: string; email: string; password: string; role: Role['value']; tenantId: string }>>;
  onAddAdmin: () => void;
  roles: Role[];
  tenants: Tenant[];
  currentUserRole: User['role'] | undefined;
  activeTenantId: string | null;
}

const AddAdministratorForm: React.FC<AddAdministratorFormProps> = ({
  isOpen,
  onClose,
  newAdmin,
  setNewAdmin,
  onAddAdmin,
  roles,
  tenants,
  currentUserRole,
  activeTenantId,
}) => {
  if (!isOpen) return null;

  // Set default tenantId for new admin based on activeTenantId if not super_admin
  React.useEffect(() => {
    if (currentUserRole !== 'super_admin' && activeTenantId) {
      setNewAdmin(prev => ({ ...prev, tenantId: activeTenantId }));
    }
  }, [currentUserRole, activeTenantId, setNewAdmin]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Add New Administrator</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              placeholder="Username"
              value={newAdmin.username}
              onChange={(e) => setNewAdmin((p) => ({ ...p, username: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin((p) => ({ ...p, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin((p) => ({ ...p, password: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={newAdmin.role}
              onChange={(e) => setNewAdmin((p) => ({ ...p, role: e.target.value as Role['value'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              {roles.filter((r) => r.value !== 'super_admin').map((r) => (
                <option key={r.id} value={r.value}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          {currentUserRole === 'super_admin' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Tenant</label>
              <select
                value={newAdmin.tenantId}
                onChange={(e) => setNewAdmin((p) => ({ ...p, tenantId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Tenant</label>
              <input
                type="text"
                value={tenants.find(t => t.id === activeTenantId)?.name || 'Default Hotspot'}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
              {/* Hidden input to ensure tenantId is passed correctly */}
              <input type="hidden" name="tenantId" value={activeTenantId || 'default-tenant'} />
            </div>
          )}
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Permissions</h4>
          <p className="text-sm text-gray-600">
            Permissions are inherited from the selected role. Custom permissions can be configured in the role editor.
          </p>
        </div>
      </div>
      <div className="flex justify-end space-x-4 mt-6 border-t pt-4">
        <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button onClick={onAddAdmin} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
          Add Administrator
        </button>
      </div>
    </div>
  );
};

export default AddAdministratorForm;