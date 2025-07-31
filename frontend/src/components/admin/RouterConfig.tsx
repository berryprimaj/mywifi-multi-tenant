import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import toast from 'react-hot-toast';
import Layout from './Layout';
import { useSettings } from '../../contexts/SettingsContext';
import { useTenant } from '../../contexts/TenantContext';

// Import modular components
import MikrotikConnectionSettings from './routerconfig/MikrotikConnectionSettings';
import RouterStatusOverview from './routerconfig/RouterStatusOverview';
import NetworkInterfacesTable from './routerconfig/NetworkInterfacesTable';
import HotspotProfilesTable from './routerconfig/HotspotProfilesTable';
import AddHotspotProfileModal from './routerconfig/AddHotspotProfileModal';
import AddInterfaceModal from './routerconfig/AddInterfaceModal';

// Define types for data used in this component and passed to children
type Interface = {
  name: string;
  mac: string;
  type: 'Ethernet' | 'Wireless';
  ip: string;
  status: 'running' | 'disabled';
  rx: string;
  tx: string;
  tenantId: string;
};

export type Profile = {
  name: string;
  sessionTimeout: string;
  idleTimeout: string;
  sharedUsers: number;
  rateLimit: string;
  status: 'active' | 'inactive';
  tenantId: string;
};

// Dummy data (will be replaced by API calls in a real application)
const allInterfaces: Interface[] = [
  { name: 'ether1-gateway', mac: 'D4:CA:6D:11:22:31', type: 'Ethernet', ip: '10.0.0.15/24', status: 'running', rx: '15.7 GB', tx: '4.2 GB', tenantId: 'default-tenant' },
  { name: 'ether2-master', mac: 'D4:CA:6D:11:22:32', type: 'Ethernet', ip: '192.168.88.1/24', status: 'running', rx: '3.1 GB', tx: '8.9 GB', tenantId: 'default-tenant' },
  { name: 'ether3-slave', mac: 'D4:CA:6D:11:22:33', type: 'Ethernet', ip: '-', status: 'running', rx: '1.2 GB', tx: '500 MB', tenantId: 'default-tenant' },
  { name: 'ether4-slave', mac: 'D4:CA:6D:11:22:34', type: 'Ethernet', ip: '-', status: 'disabled', rx: '0 B', tx: '0 B', tenantId: 'default-tenant' },
  { name: 'ether5-slave', mac: 'D4:CA:6D:11:22:35', type: 'Ethernet', ip: '-', status: 'running', rx: '800 MB', tx: '250 MB', tenantId: 'default-tenant' },
  { name: 'wlan1-hotspot', mac: 'A1:B2:C3:D4:E5:F6', type: 'Wireless', ip: '172.16.0.1/24', status: 'running', rx: '5.0 GB', tx: '2.0 GB', tenantId: 'tenant-1700000000000' },
  { name: 'bridge-lan', mac: 'F6:E5:D4:C3:B2:A1', type: 'Ethernet', ip: '192.168.100.1/24', status: 'running', rx: '1.0 GB', tx: '0.5 GB', tenantId: 'tenant-1700000000000' },
];

const allProfiles: Profile[] = [
  { name: 'Default', sessionTimeout: '1h', idleTimeout: '30m', sharedUsers: 1, rateLimit: '2M/1M', status: 'active', tenantId: 'default-tenant' },
  { name: 'Premium', sessionTimeout: '4h', idleTimeout: '1h', sharedUsers: 2, rateLimit: '10M/5M', status: 'active', tenantId: 'default-tenant' },
  { name: 'Guest', sessionTimeout: '30m', idleTimeout: '15m', sharedUsers: 1, rateLimit: '1M/512K', status: 'inactive', tenantId: 'default-tenant' },
  { name: 'TenantX-Basic', sessionTimeout: '45m', idleTimeout: '20m', sharedUsers: 1, rateLimit: '1.5M/768K', status: 'active', tenantId: 'tenant-1700000000000' },
  { name: 'TenantX-VIP', sessionTimeout: '3h', idleTimeout: '45m', sharedUsers: 3, rateLimit: '15M/8M', status: 'active', tenantId: 'tenant-1700000000000' },
];

const RouterConfig = () => {
  const { apiKeys, updateApiKeys, saveSettingsToBackend } = useSettings();
  const { activeTenantId } = useTenant();
  const [isOnlineMode, setIsOnlineMode] = useState(true);

  // State for filtered data
  const [interfaces, setInterfaces] = useState<Interface[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  // Modals for Interfaces
  const [isAddInterfaceModalOpen, setIsAddInterfaceModalOpen] = useState(false);
  const [isEditInterfaceModalOpen, setIsEditInterfaceModalOpen] = useState(false);
  const [isDeleteInterfaceModalOpen, setIsDeleteInterfaceModalOpen] = useState(false);
  const [selectedInterface, setSelectedInterface] = useState<Interface | null>(null);
  const [editedInterface, setEditedInterface] = useState<Interface | null>(null);

  // Modals for Profiles
  const [isAddProfileModalOpen, setIsAddProfileModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isDeleteProfileModalOpen, setIsDeleteProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);

  // Filter data when activeTenantId changes (removed fetchSettingsFromBackend to prevent theme reset)
  useEffect(() => {
    setInterfaces(allInterfaces.filter(iface => iface.tenantId === activeTenantId));
    setProfiles(allProfiles.filter(profile => profile.tenantId === activeTenantId));
  }, [activeTenantId]);

  const handleTestConnection = async () => {
    if (!apiKeys.mikrotikHost || !apiKeys.mikrotikPort || !apiKeys.mikrotikUsername || !apiKeys.mikrotikPassword) {
      toast.error('Please fill all MikroTik connection fields before testing.');
      return;
    }
    const toastId = toast.loading('Testing connection...');
    try {
      console.log('Testing connection with:', {
        host: apiKeys.mikrotikHost,
        port: apiKeys.mikrotikPort,
        username: apiKeys.mikrotikUsername,
        password: apiKeys.mikrotikPassword,
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Connection to MikroTik successful!', { id: toastId });
    } catch (error) {
      toast.error('Connection failed. Please check settings.', { id: toastId });
    }
  };

  // Router Status & Management Handlers
  const handleBackup = () => {
    toast.success('Router backup initiated! (Simulated)');
  };

  const handleRestartHotspot = () => {
    toast.success('Hotspot restarted successfully! (Simulated)');
  };

  const handleReboot = () => {
    toast.success('Router reboot initiated! (Simulated)');
  };

  // Interface Handlers
  const handleAddInterface = (newInterfaceData: Omit<Interface, 'tenantId' | 'mac' | 'rx' | 'tx'>) => {
    console.log('Attempting to add new interface:', newInterfaceData); // Log for debugging
    if (!activeTenantId) {
      toast.error('No active tenant selected. Cannot add interface.');
      return;
    }
    const newInterface: Interface = {
      ...newInterfaceData,
      mac: 'XX:XX:XX:XX:XX:XX', // Dummy MAC for new interface
      rx: '0 B',
      tx: '0 B',
      tenantId: activeTenantId,
    };
    setInterfaces(prev => [...prev, newInterface]);
    toast.success(`Interface '${newInterface.name}' added successfully!`);
    setIsAddInterfaceModalOpen(false);
  };

  const handleEditInterface = (ifaceName: string) => {
    const iface = interfaces.find(i => i.name === ifaceName);
    if (iface) {
      setSelectedInterface(iface);
      setEditedInterface({ ...iface });
      setIsEditInterfaceModalOpen(true);
    }
  };

  const handleDeleteInterface = (ifaceName: string) => {
    const iface = interfaces.find(i => i.name === ifaceName);
    if (iface) {
      setSelectedInterface(iface);
      setIsDeleteInterfaceModalOpen(true);
    }
  };

  const confirmEditInterface = () => {
    if (editedInterface) {
      toast.success(`Interface ${editedInterface.name} updated successfully!`);
      setInterfaces(prev => prev.map(i => i.name === editedInterface.name ? editedInterface : i));
      setIsEditInterfaceModalOpen(false);
    }
  };

  const confirmDeleteInterface = () => {
    if (selectedInterface) {
      toast.success(`Interface ${selectedInterface.name} deleted successfully!`);
      setInterfaces(prev => prev.filter(i => i.name !== selectedInterface.name));
      setIsDeleteInterfaceModalOpen(false);
    }
  };

  const handleEditInterfaceFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editedInterface) {
      setEditedInterface({
        ...editedInterface,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Profile Handlers
  const handleAddProfile = (newProfileData: Omit<Profile, 'tenantId' | 'status'>) => {
    if (!activeTenantId) {
      toast.error('No active tenant selected. Cannot add profile.');
      return;
    }
    const newProfile: Profile = {
      ...newProfileData,
      status: 'active',
      tenantId: activeTenantId,
    };
    setProfiles(prev => [...prev, newProfile]);
    toast.success(`Profile '${newProfile.name}' added successfully!`);
    setIsAddProfileModalOpen(false);
  };

  const handleEditProfile = (profileName: string) => {
    const profile = profiles.find(p => p.name === profileName);
    if (profile) {
      setSelectedProfile(profile);
      setEditedProfile({ ...profile });
      setIsEditProfileModalOpen(true);
    }
  };

  const handleDeleteProfile = (profileName: string) => {
    const profile = profiles.find(p => p.name === profileName);
    if (profile) {
      setSelectedProfile(profile);
      setIsDeleteProfileModalOpen(true);
    }
  };

  const confirmEditProfile = () => {
    if (editedProfile) {
      toast.success(`Profile ${editedProfile.name} updated successfully!`);
      setProfiles(prev => prev.map(p => p.name === editedProfile.name ? editedProfile : p));
      setIsEditProfileModalOpen(false);
    }
  };

  const confirmDeleteProfile = () => {
    if (selectedProfile) {
      toast.success(`Profile ${selectedProfile.name} deleted successfully!`);
      setProfiles(prev => prev.filter(p => p.name !== selectedProfile.name));
      setIsDeleteProfileModalOpen(false);
    }
  };

  const handleEditProfileFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [e.target.name]: e.target.value,
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Router Configuration</h1>
          <p className="text-gray-600 dark:text-gray-300">Configure and monitor your MikroTik Router</p>
        </div>

        <MikrotikConnectionSettings
          apiKeys={apiKeys}
          updateApiKeys={updateApiKeys}
          saveSettingsToBackend={saveSettingsToBackend}
          handleTestConnection={handleTestConnection}
          isOnlineMode={isOnlineMode}
          setIsOnlineMode={setIsOnlineMode}
        />

        <RouterStatusOverview
          handleBackup={handleBackup}
          handleRestartHotspot={handleRestartHotspot}
          handleReboot={handleReboot}
        />

        <NetworkInterfacesTable
          interfaces={interfaces}
          setIsAddInterfaceModalOpen={setIsAddInterfaceModalOpen}
          handleEditInterface={handleEditInterface}
          handleDeleteInterface={handleDeleteInterface}
        />

        <HotspotProfilesTable
          profiles={profiles}
          setIsAddProfileModalOpen={setIsAddProfileModalOpen}
          handleEditProfile={handleEditProfile}
          handleDeleteProfile={handleDeleteProfile}
        />
      </div>

      {/* Modals for Interfaces */}
      <Modal isOpen={isEditInterfaceModalOpen} onClose={() => setIsEditInterfaceModalOpen(false)} title={`Edit Interface: ${selectedInterface?.name}`}>
        {editedInterface && (
          <form onSubmit={(e) => { e.preventDefault(); confirmEditInterface(); }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interface Name</label>
                <input type="text" value={editedInterface.name} readOnly className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">IP Address (CIDR)</label>
                <input type="text" name="ip" value={editedInterface.ip} onChange={handleEditInterfaceFormChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select name="status" value={editedInterface.status} onChange={handleEditInterfaceFormChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <option value="running">Running</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-6 mt-4 border-t">
              <button type="button" onClick={() => setIsEditInterfaceModalOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Save Changes</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal isOpen={isDeleteInterfaceModalOpen} onClose={() => setIsDeleteInterfaceModalOpen(false)} title="Confirm Deletion">
        {selectedInterface && (
          <div>
            <p>Are you sure you want to delete the interface <strong>{selectedInterface.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4 pt-6">
              <button onClick={() => setIsDeleteInterfaceModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={confirmDeleteInterface} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">Delete</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Hotspot Profile Modal */}
      <AddHotspotProfileModal
        isOpen={isAddProfileModalOpen}
        onClose={() => setIsAddProfileModalOpen(false)}
        onAddProfile={handleAddProfile}
      />

      <Modal isOpen={isEditProfileModalOpen} onClose={() => setIsEditProfileModalOpen(false)} title={`Edit Profile: ${selectedProfile?.name}`}>
        {editedProfile && (
          <form onSubmit={(e) => { e.preventDefault(); confirmEditProfile(); }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Name</label>
                <input type="text" name="name" value={editedProfile.name} onChange={handleEditProfileFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout</label>
                <input type="text" name="sessionTimeout" value={editedProfile.sessionTimeout} onChange={handleEditProfileFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Idle Timeout</label>
                <input type="text" name="idleTimeout" value={editedProfile.idleTimeout} onChange={handleEditProfileFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shared Users</label>
                <input type="number" name="sharedUsers" value={editedProfile.sharedUsers} onChange={handleEditProfileFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rate Limit</label>
                <input type="text" name="rateLimit" value={editedProfile.rateLimit} onChange={handleEditProfileFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" value={editedProfile.status} onChange={handleEditProfileFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-6 mt-4 border-t">
              <button type="button" onClick={() => setIsEditProfileModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Save Changes</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal isOpen={isDeleteProfileModalOpen} onClose={() => setIsDeleteProfileModalOpen(false)} title="Confirm Deletion">
        {selectedProfile && (
          <div>
            <p>Are you sure you want to delete the profile <strong>{selectedProfile.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4 pt-6">
              <button onClick={() => setIsDeleteProfileModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={confirmDeleteProfile} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">Delete</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Network Interface Modal */}
      <AddInterfaceModal
        isOpen={isAddInterfaceModalOpen}
        onClose={() => setIsAddInterfaceModalOpen(false)}
        onAddInterface={handleAddInterface}
      />
    </Layout>
  );
};

export default RouterConfig;