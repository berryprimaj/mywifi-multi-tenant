import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Edit, Trash2, MessageCircle, Calendar, Mail } from 'lucide-react';
import Layout from './Layout';
import Modal from '../common/Modal';
import { useTenant } from '../../contexts/TenantContext'; // Import useTenant

type SocialUser = {
  id: number;
  name: string;
  email: string;
  ip: string;
  whatsapp: string;
  provider: 'Google' | 'WhatsApp';
  connectedAt: string;
  session: string;
  dataUsage: string;
  status: 'online' | 'offline';
  tenantId: string; // Added tenantId
};

const allUsers: SocialUser[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    ip: '192.168.1.101',
    whatsapp: '+6281234567890',
    provider: 'Google',
    connectedAt: '2025-01-07 09:30:00',
    session: '2h 15m',
    dataUsage: '450MB',
    status: 'online',
    tenantId: 'default-tenant'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@gmail.com',
    ip: '192.168.1.102',
    whatsapp: '+6281234567891',
    provider: 'Google',
    connectedAt: '2025-01-07 10:15:00',
    session: '1h 45m',
    dataUsage: '320MB',
    status: 'online',
    tenantId: 'default-tenant'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    ip: '192.168.1.103',
    whatsapp: '+6281234567892',
    provider: 'WhatsApp',
    connectedAt: '2025-01-07 08:45:00',
    session: '3h 20m',
    dataUsage: '680MB',
    status: 'offline',
    tenantId: 'default-tenant'
  },
  // Example users for another tenant
  {
    id: 4,
    name: 'TenantX User A',
    email: 'usera@tenantx.com',
    ip: '10.0.0.10',
    whatsapp: '+6281122334455',
    provider: 'WhatsApp',
    connectedAt: '2025-01-08 11:00:00',
    session: '1h 30m',
    dataUsage: '200MB',
    status: 'online',
    tenantId: 'tenant-1700000000000'
  },
  {
    id: 5,
    name: 'TenantX User B',
    email: 'userb@tenantx.com',
    ip: '10.0.0.11',
    whatsapp: '+6285566778899',
    provider: 'Google',
    connectedAt: '2025-01-08 10:00:00',
    session: '2h 0m',
    dataUsage: '350MB',
    status: 'online',
    tenantId: 'tenant-1700000000000'
  }
];

const SocialUsers = () => {
  const { activeTenantId } = useTenant(); // Get activeTenantId
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('All Providers');
  const [dateRange, setDateRange] = useState('Custom Range');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SocialUser | null>(null);
  const [editedUser, setEditedUser] = useState<SocialUser | null>(null);
  const [whatsAppMessage, setWhatsAppMessage] = useState('');

  const handleSearch = () => {
    if (startDate && endDate) {
      alert(`Searching users from ${startDate} to ${endDate}`);
    } else {
      alert('Please select both start and end dates');
    }
  };

  const handleDeleteRange = () => {
    if (startDate && endDate) {
      if (confirm(`Are you sure you want to delete users from ${startDate} to ${endDate}?`)) {
        alert(`Deleting users from ${startDate} to ${endDate}`);
      }
    } else {
      alert('Please select both start and end dates');
    }
  };

  const handleExport = () => {
    const headers = ['Name', 'Email', 'WhatsApp', 'Provider', 'Connected At', 'Session', 'Data Usage', 'Status', 'Tenant ID'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.whatsapp,
        user.provider,
        user.connectedAt,
        user.session,
        user.dataUsage,
        user.status,
        user.tenantId
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `social-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleViewUser = (userId: number) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsViewModalOpen(true);
    }
  };

  const handleEditUser = (userId: number) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setEditedUser({ ...user });
      setIsEditModalOpen(true);
    }
  };

  const handleSendWhatsApp = (userId: number) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsWhatsAppModalOpen(true);
    }
  };

  const handleDeleteUser = (userId: number) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    if (selectedUser) {
      alert(`Deleting user: ${selectedUser.name}`);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const confirmEdit = () => {
    if (editedUser) {
      alert(`Saving changes for user: ${editedUser.name}`);
      setIsEditModalOpen(false);
      setEditedUser(null);
      setSelectedUser(null);
    }
  };

  const confirmSendWhatsApp = () => {
    if (selectedUser && whatsAppMessage) {
      alert(`Sending message to ${selectedUser.name}: "${whatsAppMessage}"`);
      setIsWhatsAppModalOpen(false);
      setSelectedUser(null);
      setWhatsAppMessage('');
    }
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        [e.target.name]: e.target.value,
      });
    }
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesTenant = user.tenantId === activeTenantId; // Filter by active tenant
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.whatsapp.includes(searchTerm);
    const matchesProvider = selectedProvider === 'All Providers' || user.provider === selectedProvider;
    return matchesTenant && matchesSearch && matchesProvider;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Social Users</h1>
            <p className="text-gray-600">Manage users connected via social media</p>
          </div>
          <button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>

        {/* Statistics, Auto Delete, Filters... (code omitted for brevity) */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Auto Delete Settings</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Custom Range</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col justify-end">
              <div className="flex space-x-2">
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
                <button
                  onClick={handleDeleteRange}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or WhatsApp number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>All Providers</option>
                <option>Google</option>
                <option>WhatsApp</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th> {/* Changed header */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Connected At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">{user.ip}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.provider === 'WhatsApp' ? (
                          <>
                            <MessageCircle className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-sm text-gray-900">{user.whatsapp}</span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-sm text-gray-900">{user.email}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.provider === 'Google' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.provider}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.connectedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.session}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.dataUsage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleViewUser(user.id)} className="p-1.5 rounded-md text-blue-600 hover:bg-blue-100" title="View User"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleEditUser(user.id)} className="p-1.5 rounded-md text-green-600 hover:bg-green-100" title="Edit User"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleSendWhatsApp(user.id)} className="p-1.5 rounded-md text-orange-600 hover:bg-orange-100" title="Send WhatsApp"><MessageCircle className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteUser(user.id)} className="p-1.5 rounded-md text-red-600 hover:bg-red-100" title="Delete User"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={`View User: ${selectedUser?.name}`}>
        {selectedUser && (
          <div className="space-y-3 text-sm">
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>WhatsApp:</strong> {selectedUser.whatsapp}</p>
            <p><strong>IP Address:</strong> {selectedUser.ip}</p>
            <p><strong>Provider:</strong> {selectedUser.provider}</p>
            <p><strong>Connected At:</strong> {selectedUser.connectedAt}</p>
            <p><strong>Status:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${selectedUser.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{selectedUser.status}</span></p>
            <div className="flex justify-end pt-4">
              <button onClick={() => setIsViewModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Close</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit User: ${selectedUser?.name}`}>
        {editedUser && (
          <form onSubmit={(e) => { e.preventDefault(); confirmEdit(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" name="name" value={editedUser.name} onChange={handleEditFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={editedUser.email} onChange={handleEditFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input type="tel" name="whatsapp" value={editedUser.whatsapp} onChange={handleEditFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-6">
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Save Changes</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal isOpen={isWhatsAppModalOpen} onClose={() => setIsWhatsAppModalOpen(false)} title={`Send WhatsApp to ${selectedUser?.name}`}>
        {selectedUser && (
          <form onSubmit={(e) => { e.preventDefault(); confirmSendWhatsApp(); }}>
            <p className="mb-4">To: {selectedUser.whatsapp}</p>
            <textarea
              value={whatsAppMessage}
              onChange={(e) => setWhatsAppMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Type your message here..."
            />
            <div className="flex justify-end space-x-4 pt-6">
              <button type="button" onClick={() => setIsWhatsAppModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Send Message</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        {selectedUser && (
          <div>
            <p>Are you sure you want to delete the user <strong>{selectedUser.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4 pt-6">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default SocialUsers;