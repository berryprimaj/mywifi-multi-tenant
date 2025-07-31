import { useState } from 'react';
import Layout from '../../components/admin/Layout';
import { Plus, Building2, Search, X } from 'lucide-react'; // Removed Edit
import { useTenant } from '../../contexts/TenantContext';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const TenantManagement = () => {
  const { tenants, addTenant, deleteTenant, selectTenant, renameTenant, activeTenantId } = useTenant();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantDomain, setNewTenantDomain] = useState(''); // New state for domain
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tenantToEdit, setTenantToEdit] = useState<string | null>(null);
  const [editedTenantName, setEditedTenantName] = useState('');

  const handleAddTenant = () => {
    if (newTenantName.trim()) {
      addTenant(newTenantName.trim(), newTenantDomain.trim() || undefined); // Pass domain, or undefined if empty
      setNewTenantName('');
      setNewTenantDomain(''); // Clear domain field
      setShowAddForm(false);
    } else {
      toast.error('Tenant name cannot be empty.');
    }
  };

  const handleDeleteClick = (tenantId: string) => {
    if (tenantId === activeTenantId) {
      toast.error('Cannot delete the currently active tenant.');
      return;
    }
    if (tenants.length === 1) {
      toast.error('Cannot delete the last tenant.');
      return;
    }
    setTenantToDelete(tenantId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteTenant = () => {
    if (tenantToDelete) {
      deleteTenant(tenantToDelete);
      setIsDeleteModalOpen(false);
      setTenantToDelete(null);
    }
  };

  const handleEditClick = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      setTenantToEdit(tenantId);
      setEditedTenantName(tenant.name);
      setIsEditModalOpen(true);
    }
  };

  const confirmRenameTenant = () => {
    if (tenantToEdit && editedTenantName.trim()) {
      renameTenant(tenantToEdit, editedTenantName.trim());
      setIsEditModalOpen(false);
      setTenantToEdit(null);
      setEditedTenantName('');
    } else {
      toast.error('New tenant name cannot be empty.');
    }
  };

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tenant.domain && tenant.domain.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tenant Management</h1>
            <p className="text-gray-600">Create and manage your hotspot tenants</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Tenant</span>
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Add New Tenant</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tenant Name</label>
                <input
                  type="text"
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., My Cafe Hotspot, Office WiFi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Domain/Subdomain (Optional)</label>
                <input
                  type="text"
                  value={newTenantDomain}
                  onChange={(e) => setNewTenantDomain(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., cafe.myhotspot.com"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleAddTenant} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Add Tenant</button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tenants by name or domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenants.map((tenant) => (
              <div key={tenant.id} className={`bg-gray-50 rounded-lg p-4 border ${activeTenantId === tenant.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} flex flex-col`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-gray-600" />
                    <h4 className="font-bold text-gray-900">{tenant.name}</h4>
                  </div>
                  {activeTenantId === tenant.id && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Active</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">ID: {tenant.id}</p>
                {tenant.domain && (
                  <p className="text-sm text-gray-600 mb-4">Domain: {tenant.domain}</p>
                )}
                <div className="flex justify-end space-x-2 mt-auto">
                  {activeTenantId !== tenant.id && (
                    <button
                      onClick={() => selectTenant(tenant.id)}
                      className="px-3 py-1 border border-blue-500 text-blue-500 rounded-md text-sm hover:bg-blue-50"
                    >
                      Select
                    </button>
                  )}
                  <button
                    onClick={() => handleEditClick(tenant.id)}
                    className="px-3 py-1 border border-green-500 text-green-500 rounded-md text-sm hover:bg-green-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(tenant.id)}
                    className="px-3 py-1 border border-red-500 text-red-500 rounded-md text-sm hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Tenant Deletion">
        <div>
          <p>Are you sure you want to delete the tenant <strong>{tenants.find(t => t.id === tenantToDelete)?.name}</strong>?</p>
          <p className="text-sm text-red-600 mt-2">This will delete all associated settings and cannot be undone.</p>
          <div className="flex justify-end space-x-4 pt-6">
            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={confirmDeleteTenant} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">Delete Tenant</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit Tenant: ${tenants.find(t => t.id === tenantToEdit)?.name}`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Tenant Name</label>
          <input
            type="text"
            value={editedTenantName}
            onChange={(e) => setEditedTenantName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter new tenant name"
          />
          <div className="flex justify-end space-x-4 pt-6">
            <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={confirmRenameTenant} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Save Changes</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default TenantManagement;