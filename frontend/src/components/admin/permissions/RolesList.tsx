import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Role } from '../../../types';
import { Admin, User } from '../../../contexts/AuthContext';

interface RolesListProps {
  roles: Role[];
  admins: Admin[];
  onEditRole: (roleId: string) => void;
  onDeleteRole: (roleId: string) => void;
  currentUserRole: User['role'] | undefined; // Added currentUserRole prop
}

const RolesList: React.FC<RolesListProps> = ({ roles, admins, onEditRole, onDeleteRole, currentUserRole }) => {
  // Filter roles: hide 'super_admin' role if the current user is not a super_admin
  const filteredRoles = roles.filter(role => 
    role.value !== 'super_admin' || currentUserRole === 'super_admin'
  );

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Static Role-Based Access Control (Static RBAC)</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {filteredRoles.map((role) => ( // Use filteredRoles here
          <div key={role.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-gray-900">{role.name}</h4>
                <span className="text-sm text-gray-500">{admins.filter((a) => a.role === role.value).length} Users</span>
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={() => onEditRole(role.id)} className="p-1.5 rounded-md text-blue-600 hover:bg-blue-100" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                {role.value !== 'super_admin' && (
                  <button onClick={() => onDeleteRole(role.id)} className="p-1.5 rounded-md text-red-600 hover:bg-red-100" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex-grow">
              <p className="text-xs text-gray-600 mb-2">{role.description}</p>
              <p className="text-xs font-medium text-gray-800 mb-1">Permissions:</p>
              {role.permissions[0] === '*' ? (
                <span className="text-xs font-semibold text-red-600">All Permissions</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 2).map((p) => (
                    <span key={p} className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                      {p}
                    </span>
                  ))}
                  {role.permissions.length > 2 && (
                    <span className="text-xs bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded">
                      +{role.permissions.length - 2} more
                    </span>
                  )}
                </div>
              )}
              {role.passwordExpiryDays !== undefined && (
                <p className="text-xs font-medium text-gray-800 mt-2">
                  Password Expiry: {role.passwordExpiryDays === null ? 'No Expiry' : `${role.passwordExpiryDays} Days`}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolesList;