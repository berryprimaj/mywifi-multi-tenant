import React, { useState } from 'react';
import Modal from '../../common/Modal';
import { Interface } from '../RouterConfig'; // Import Interface type from RouterConfig

interface AddInterfaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddInterface: (newInterface: Omit<Interface, 'tenantId' | 'mac' | 'rx' | 'tx'>) => void;
}

const AddInterfaceModal: React.FC<AddInterfaceModalProps> = ({ isOpen, onClose, onAddInterface }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'Ethernet' | 'Wireless'>('Ethernet');
  const [ip, setIp] = useState('');
  const [status, setStatus] = useState<'running' | 'disabled'>('running');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ip) {
      alert('Please fill all required fields.');
      return;
    }
    onAddInterface({ name, type, ip, status });
    setName('');
    setType('Ethernet');
    setIp('');
    setStatus('running');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Network Interface">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interface Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., ether1-wan, wlan1-hotspot"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interface Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'Ethernet' | 'Wireless')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
              required
            >
              <option value="Ethernet">Ethernet</option>
              <option value="Wireless">Wireless</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IP Address (CIDR)</label>
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., 192.168.1.1/24"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'running' | 'disabled')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
              required
            >
              <option value="running">Running</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-4 pt-6 mt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Add Interface
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddInterfaceModal;