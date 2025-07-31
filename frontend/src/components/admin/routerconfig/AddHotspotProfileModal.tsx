import React, { useState } from 'react';
import Modal from '../../common/Modal';
import { Profile } from '../RouterConfig'; // Import Profile type from RouterConfig

interface AddHotspotProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProfile: (newProfile: Omit<Profile, 'tenantId' | 'status'>) => void;
}

const AddHotspotProfileModal: React.FC<AddHotspotProfileModalProps> = ({ isOpen, onClose, onAddProfile }) => {
  const [name, setName] = useState('');
  const [sessionTimeout, setSessionTimeout] = useState('');
  const [idleTimeout, setIdleTimeout] = useState('');
  const [sharedUsers, setSharedUsers] = useState(1);
  const [rateLimit, setRateLimit] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sessionTimeout || !idleTimeout || !rateLimit) {
      alert('Please fill all required fields.');
      return;
    }
    onAddProfile({ name, sessionTimeout, idleTimeout, sharedUsers, rateLimit });
    setName('');
    setSessionTimeout('');
    setIdleTimeout('');
    setSharedUsers(1);
    setRateLimit('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Hotspot Profile">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Premium, Free_1Hour"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (e.g., 1h, 30m)</label>
              <input
                type="text"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 1h, 30m, 4h"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Idle Timeout (e.g., 15m, 1h)</label>
              <input
                type="text"
                value={idleTimeout}
                onChange={(e) => setIdleTimeout(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 15m, 1h"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shared Users</label>
              <input
                type="number"
                value={sharedUsers}
                onChange={(e) => setSharedUsers(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rate Limit (Up/Down)</label>
              <input
                type="text"
                value={rateLimit}
                onChange={(e) => setRateLimit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 2M/1M, 10M/5M"
                required
              />
            </div>
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
            Add Profile
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddHotspotProfileModal;