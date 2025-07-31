import React from 'react';
import Modal from '../../common/Modal';

interface GlobalPasswordSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  passwordSettings: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
    lockoutAttempts: number;
  };
  onPasswordSettingsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSavePasswordSettings: () => void;
}

const GlobalPasswordSettingsModal: React.FC<GlobalPasswordSettingsModalProps> = ({
  isOpen,
  onClose,
  passwordSettings,
  onPasswordSettingsChange,
  onSavePasswordSettings,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Global Password Security Settings">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Length</label>
          <input
            type="number"
            name="minLength"
            value={passwordSettings.minLength}
            onChange={onPasswordSettingsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            min="1"
          />
        </div>
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            name="requireUppercase"
            checked={passwordSettings.requireUppercase}
            onChange={onPasswordSettingsChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 block text-sm text-gray-900">Require Uppercase</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="requireNumbers"
            checked={passwordSettings.requireNumbers}
            onChange={onPasswordSettingsChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 block text-sm text-gray-900">Require Numbers</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="requireSymbols"
            checked={passwordSettings.requireSymbols}
            onChange={onPasswordSettingsChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 block text-sm text-gray-900">Require Symbols</label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Lockout Attempts</label>
          <input
            type="number"
            name="lockoutAttempts"
            value={passwordSettings.lockoutAttempts}
            onChange={onPasswordSettingsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            min="0"
          />
        </div>
      </div>
      <div className="flex justify-end mt-6 border-t pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSavePasswordSettings}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Save Settings
        </button>
      </div>
    </Modal>
  );
};

export default GlobalPasswordSettingsModal;