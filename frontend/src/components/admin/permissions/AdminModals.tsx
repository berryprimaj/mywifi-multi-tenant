import React from 'react';
import Modal from '../../common/Modal';
import { Admin } from '../../../contexts/AuthContext';
import { Role, Tenant } from '../../../types';

interface AdminModalsProps {
  isViewModalOpen: boolean;
  setIsViewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditModalOpen: boolean;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedAdmin: Admin | null;
  editedAdmin: Admin | null;
  setEditedAdmin: React.Dispatch<React.SetStateAction<Admin | null>>;
  onConfirmEditAdmin: () => void;
  onConfirmDeleteAdmin: () => void;
  onEditAdminFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  getTenantName: (tenantId: string) => string;
  roles: Role[];
  tenants: Tenant[];
}

const AdminModals: React.FC<AdminModalsProps> = ({
  isViewModalOpen,
  setIsViewModalOpen,
  isEditModalOpen,
  setIsEditModalOpen,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedAdmin,
  editedAdmin,
  setEditedAdmin,
  onConfirmEditAdmin,
  onConfirmDeleteAdmin,
  onEditAdminFormChange,
  getTenantName,
  roles,
  tenants,
}) => {
  return (
    <>
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={`View Administrator: ${selectedAdmin?.username}`}>
        {selectedAdmin && (
          <div className="space-y-3 text-sm">
            <p>
              <strong>Username:</strong> {selectedAdmin.username}
            </p>
            <p>
              <strong>Email:</strong> {selectedAdmin.email}
            </p>
            <p>
              <strong>Role:</strong> {selectedAdmin.role.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </p>
            <p>
              <strong>Tenant Name:</strong> {getTenantName(selectedAdmin.tenantId)}
            </p>
            <p>
              <strong>Password:</strong> {selectedAdmin.password || 'Not Set'}
            </p>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit Administrator: ${editedAdmin?.username}`}>
        {editedAdmin && (
          <form onSubmit={(e) => { e.preventDefault(); onConfirmEditAdmin(); }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={editedAdmin.username}
                  onChange={onEditAdminFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editedAdmin.email}
                  onChange={onEditAdminFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={editedAdmin.role}
                  onChange={onEditAdminFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  {roles.filter((r) => r.value !== 'super_admin').map((r) => (
                    <option key={r.id} value={r.value}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenant</label>
                <select
                  name="tenantId"
                  value={editedAdmin.tenantId}
                  onChange={onEditAdminFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password (optional)</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Leave blank to keep current password"
                  onChange={onEditAdminFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-6 mt-4 border-t">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        {selectedAdmin && (
          <div>
            <p>
              Are you sure you want to delete the administrator <strong>{selectedAdmin.username}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4 pt-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button onClick={onConfirmDeleteAdmin} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AdminModals;