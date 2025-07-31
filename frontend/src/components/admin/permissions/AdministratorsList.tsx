import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Admin, User } from '../../../contexts/AuthContext';

interface AdministratorsListProps {
  admins: Admin[];
  onViewAdmin: (admin: Admin) => void;
  onEditAdmin: (admin: Admin) => void;
  onDeleteAdmin: (admin: Admin) => void;
  currentUserRole: User['role'] | undefined;
  getTenantName: (tenantId: string) => string;
}

const AdministratorsList: React.FC<AdministratorsListProps> = ({
  admins,
  onViewAdmin,
  onEditAdmin,
  onDeleteAdmin,
  currentUserRole,
  getTenantName,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Administrator List</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{admin.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {admin.role.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getTenantName(admin.tenantId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => onViewAdmin(admin)} className="p-1.5 rounded-md text-blue-600 hover:bg-blue-100" title="View Admin">
                      <Eye className="w-4 h-4" />
                    </button>
                    {currentUserRole === 'super_admin' && admin.role !== 'super_admin' && (
                      <>
                        <button onClick={() => onEditAdmin(admin)} className="p-1.5 rounded-md text-green-600 hover:bg-green-100" title="Edit Admin">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDeleteAdmin(admin)} className="p-1.5 rounded-md text-red-600 hover:bg-red-100" title="Delete Admin">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdministratorsList;