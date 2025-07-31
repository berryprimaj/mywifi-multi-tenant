import React from 'react';
import Modal from '../../common/Modal';
import { Role } from '../../../types';

interface RoleModalsProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRole: Role | null;
  editedRole: Role | null;
  setEditedRole: React.Dispatch<React.SetStateAction<Role | null>>;
  onConfirmEditRole: () => void;
  onConfirmDeleteRole: () => void;
  onEditRoleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const RoleModals: React.FC<RoleModalsProps> = ({
  isEditModalOpen,
  setIsEditModalOpen,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedRole,
  editedRole,
  setEditedRole,
  onConfirmEditRole,
  onConfirmDeleteRole,
  onEditRoleFormChange,
}) => {
  return (
    <>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit Role: ${selectedRole?.name}`}>
        {editedRole && (
          <form onSubmit={(e) => { e.preventDefault(); onConfirmEditRole(); }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                <input
                  type="text"
                  name="name"
                  value={editedRole.name}
                  onChange={onEditRoleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  readOnly={editedRole.value === 'super_admin'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={editedRole.description}
                  onChange={onEditRoleFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Expiry (Days)</label>
                <input
                  type="number"
                  name="passwordExpiryDays"
                  value={editedRole.passwordExpiryDays === null ? '' : editedRole.passwordExpiryDays}
                  onChange={onEditRoleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter days (e.g., 90) or leave blank for no expiry"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank for no password expiry for this role.</p>
              </div>
              {/* Permissions can be added here if needed */}
            </div>
            <div className="flex justify-end space-x-4 pt-6 mt-4 border-t">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        {selectedRole && (
          <div>
            <p>
              Are you sure you want to delete role <strong>{selectedRole.name}</strong>?
            </p>
            <p className="text-sm text-red-600 mt-2">
              This action cannot be undone and will affect administrators assigned to this role.
            </p>
            <div className="flex justify-end space-x-4 pt-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button onClick={onConfirmDeleteRole} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default RoleModals;