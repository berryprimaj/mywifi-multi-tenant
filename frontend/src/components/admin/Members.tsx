import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, UserCheck, Upload, FileSpreadsheet, X, Key } from 'lucide-react';
import Layout from './Layout';
import Modal from '../common/Modal';
import toast from 'react-hot-toast';
import { useTenant } from '../../contexts/TenantContext'; // Import useTenant

type Member = {
  id: number;
  username: string;
  name: string;
  email: string;
  department: string;
  password?: string; // Password is now part of the member data
  status: 'active' | 'inactive';
  lastLogin: string;
  dataUsage: string;
  sessionTime: string;
  tenantId: string; // Added tenantId
};

const initialMembers: Member[] = [
  {
    id: 1,
    username: 'employee001',
    name: 'John Smith',
    email: 'john.smith@company.com',
    department: 'IT',
    password: 'password123',
    status: 'active',
    lastLogin: '2025-01-07 14:30:00',
    dataUsage: '1.2 GB',
    sessionTime: '4h 32m',
    tenantId: 'default-tenant'
  },
  {
    id: 2,
    username: 'employee002',
    name: 'Jane Doe',
    email: 'jane.doe@company.com',
    department: 'HR',
    password: 'password123',
    status: 'active',
    lastLogin: '2025-01-07 13:45:00',
    dataUsage: '890 MB',
    sessionTime: '2h 15m',
    tenantId: 'default-tenant'
  },
  {
    id: 3,
    username: 'employee003',
    name: 'Bob Johnson',
    email: 'bob.johnson@company.com',
    department: 'Finance',
    password: 'password123',
    status: 'inactive',
    lastLogin: '2025-01-06 16:20:00',
    dataUsage: '2.4 GB',
    sessionTime: '0m',
    tenantId: 'default-tenant'
  },
  // Example members for another tenant
  {
    id: 4,
    username: 'tenantx_emp01',
    name: 'Alice Wonderland',
    email: 'alice@tenantx.com',
    department: 'Sales',
    password: 'tenantxpass',
    status: 'active',
    lastLogin: '2025-01-08 09:00:00',
    dataUsage: '500 MB',
    sessionTime: '1h 0m',
    tenantId: 'tenant-1700000000000'
  },
  {
    id: 5,
    username: 'tenantx_emp02',
    name: 'Charlie Chaplin',
    email: 'charlie@tenantx.com',
    department: 'Marketing',
    password: 'tenantxpass',
    status: 'inactive',
    lastLogin: '2025-01-07 11:00:00',
    dataUsage: '100 MB',
    sessionTime: '0m',
    tenantId: 'tenant-1700000000000'
  }
];

const Members = () => {
  const { activeTenantId } = useTenant(); // Get activeTenantId
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newMember, setNewMember] = useState({
    username: '',
    name: '',
    email: '',
    department: '',
    password: ''
  });

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editedMember, setEditedMember] = useState<Member | null>(null);

  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const savedMembers = localStorage.getItem('hotspot-members');
      const parsedMembers = savedMembers ? JSON.parse(savedMembers) : [];
      // Ensure initialMembers are always present and have tenantId
      const combinedMembers = [...initialMembers, ...parsedMembers.filter((m: Member) => !initialMembers.some(im => im.id === m.id))];
      return combinedMembers.map((member: Member) => ({
        ...member,
        tenantId: member.tenantId || 'default-tenant' // Ensure all members have a tenantId
      }));
    } catch (error) {
      console.error("Could not parse members from localStorage", error);
      return initialMembers;
    }
  });

  useEffect(() => {
    localStorage.setItem('hotspot-members', JSON.stringify(members));
  }, [members]);

  const handleAddMember = () => {
    if (newMember.username && newMember.name && newMember.email && newMember.password) {
      const memberToAdd: Member = {
        id: Date.now(),
        username: newMember.username,
        name: newMember.name,
        email: newMember.email,
        department: newMember.department,
        password: newMember.password, // Save the password
        status: 'active',
        lastLogin: 'Never',
        dataUsage: '0 MB',
        sessionTime: '0m',
        tenantId: activeTenantId || 'default-tenant', // Assign to active tenant
      };
      setMembers(prev => [...prev, memberToAdd]);
      toast.success(`New member added: ${newMember.name}`);
      setShowAddForm(false);
      setNewMember({ username: '', name: '', email: '', department: '', password: '' });
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleExportExcel = () => {
    const headers = ['Username', 'Name', 'Email', 'Department', 'Status', 'Last Login', 'Data Usage', 'Session Time', 'Tenant ID'];
    const csvContent = [
      headers.join(','),
      ...filteredMembers.map(member => [
        member.username,
        member.name,
        member.email,
        member.department,
        member.status,
        member.lastLogin,
        member.dataUsage,
        member.sessionTime,
        member.tenantId
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `members-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Members data exported successfully!');
  };

  const handleUploadExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.success(`Uploading file: ${file.name}`);
      setShowUploadForm(false);
    }
  };

  const handleViewMember = (memberId: number) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsViewModalOpen(true);
    }
  };

  const handleViewPassword = (memberId: number) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsPasswordModalOpen(true);
    }
  };

  const handleEditMember = (memberId: number) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setEditedMember({ ...member });
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteMember = (memberId: number) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    if (selectedMember) {
      setMembers(prev => prev.filter(m => m.id !== selectedMember.id));
      toast.success(`Member '${selectedMember.name}' deleted.`);
      setIsDeleteModalOpen(false);
      setSelectedMember(null);
    }
  };

  const confirmEdit = () => {
    if (editedMember) {
      setMembers(prev => prev.map(m => (m.id === editedMember.id ? editedMember : m)));
      toast.success(`Changes for member '${editedMember.name}' saved.`);
      setIsEditModalOpen(false);
      setEditedMember(null);
      setSelectedMember(null);
    }
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editedMember) {
      setEditedMember({
        ...editedMember,
        [e.target.name]: e.target.value,
      });
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesTenant = member.tenantId === activeTenantId; // Filter by active tenant
    const matchesSearch = member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All Status' || member.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesTenant && matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Members</h1>
            <p className="text-gray-600">Manage employee member accounts</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <button 
              onClick={handleExportExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
            <button 
              onClick={() => setShowUploadForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Excel</span>
            </button>
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Add New Member</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                <input type="text" value={newMember.username} onChange={(e) => setNewMember(prev => ({ ...prev, username: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Enter username" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input type="text" value={newMember.name} onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Enter full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input type="email" value={newMember.email} onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Enter email address" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input type="text" value={newMember.department} onChange={(e) => setNewMember(prev => ({ ...prev, department: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Enter department" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input type="password" value={newMember.password} onChange={(e) => setNewMember(prev => ({ ...prev, password: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Enter password" />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleAddMember} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Add Member</button>
            </div>
          </div>
        )}

        {showUploadForm && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Upload Members from Excel</h3>
              <button onClick={() => setShowUploadForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Excel File</label>
                <input type="file" accept=".xlsx,.xls,.csv" onChange={handleUploadExcel} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Excel Format Requirements:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Column A: Username</li>
                  <li>• Column B: Full Name</li>
                  <li>• Column C: Email</li>
                  <li>• Column D: Department</li>
                  <li>• Column E: Password</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search members..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
                <option>All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-800">{filteredMembers.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full"><UserCheck className="w-6 h-6 text-blue-600" /></div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-gray-800">{filteredMembers.filter(m => m.status === 'active').length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full"><UserCheck className="w-6 h-6 text-green-600" /></div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Members</p>
                <p className="text-2xl font-bold text-gray-800">{filteredMembers.filter(m => m.status === 'inactive').length}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full"><UserCheck className="w-6 h-6 text-red-600" /></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.username}</div>
                        <div className="text-xs text-gray-400">{member.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{member.department}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.lastLogin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.dataUsage}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.sessionTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{member.status}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleViewMember(member.id)} className="p-1.5 rounded-md text-blue-600 hover:bg-blue-100" title="View Member"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleViewPassword(member.id)} className="p-1.5 rounded-md text-yellow-600 hover:bg-yellow-100" title="View Password"><Key className="w-4 h-4" /></button>
                        <button onClick={() => handleEditMember(member.id)} className="p-1.5 rounded-md text-green-600 hover:bg-green-100" title="Edit Member"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteMember(member.id)} className="p-1.5 rounded-md text-red-600 hover:bg-red-100" title="Delete Member"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={`View Member: ${selectedMember?.name}`}>
        {selectedMember && (
          <div className="space-y-3 text-sm">
            <p><strong>Username:</strong> {selectedMember.username}</p>
            <p><strong>Full Name:</strong> {selectedMember.name}</p>
            <p><strong>Email:</strong> {selectedMember.email}</p>
            <p><strong>Department:</strong> {selectedMember.department}</p>
            <p><strong>Status:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${selectedMember.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{selectedMember.status}</span></p>
            <p><strong>Last Login:</strong> {selectedMember.lastLogin}</p>
            <p><strong>Data Usage:</strong> {selectedMember.dataUsage}</p>
            <p><strong>Session Time:</strong> {selectedMember.sessionTime}</p>
            <div className="flex justify-end pt-4">
              <button onClick={() => setIsViewModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Close</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} title={`Password for ${selectedMember?.username}`}>
        {selectedMember && (
          <div className="space-y-4 text-sm">
            <div>
              <label className="font-semibold text-gray-700">Username</label>
              <p className="mt-1 p-2 bg-gray-100 rounded-md">{selectedMember.username}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Password</label>
              <p className="mt-1 p-2 bg-gray-100 rounded-md font-mono">{selectedMember.password || 'Not set'}</p>
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Close</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit Member: ${selectedMember?.name}`}>
        {editedMember && (
          <form onSubmit={(e) => { e.preventDefault(); confirmEdit(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input type="text" name="username" value={editedMember.username} onChange={handleEditFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" name="name" value={editedMember.name} onChange={handleEditFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={editedMember.email} onChange={handleEditFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input type="text" name="department" value={editedMember.department} onChange={handleEditFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" value={editedMember.status} onChange={handleEditFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-6">
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Save Changes</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        {selectedMember && (
          <div>
            <p>Are you sure you want to delete the member <strong>{selectedMember.name}</strong>? This action cannot be undone.</p>
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

export default Members;