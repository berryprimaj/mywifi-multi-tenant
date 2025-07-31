import React from 'react';
import { Plus, Edit, Trash2, Wifi, Network } from 'lucide-react';

// Define Interface type locally for this component's props
interface Interface {
  name: string;
  mac: string;
  type: 'Ethernet' | 'Wireless';
  ip: string;
  status: 'running' | 'disabled';
  rx: string;
  tx: string;
  tenantId: string;
}

interface NetworkInterfacesTableProps {
  interfaces: Interface[];
  setIsAddInterfaceModalOpen: (isOpen: boolean) => void;
  handleEditInterface: (ifaceName: string) => void;
  handleDeleteInterface: (ifaceName: string) => void;
}

const NetworkInterfacesTable: React.FC<NetworkInterfacesTableProps> = ({
  interfaces,
  setIsAddInterfaceModalOpen,
  handleEditInterface,
  handleDeleteInterface,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Network Interfaces</h3>
        <button 
          onClick={() => setIsAddInterfaceModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 text-sm"
        >
          <Plus className="w-4 h-4" /><span>Add Interface</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interface</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Traffic</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {interfaces.map((iface) => (
              <tr key={iface.name}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{iface.name}</div>
                  <div className="text-xs text-gray-500">{iface.mac}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {iface.type === 'Wireless' ? <Wifi className="w-4 h-4 text-gray-500" /> : <Network className="w-4 h-4 text-gray-500" />}
                    <span>{iface.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">{iface.ip}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-800">RX: {iface.rx}</div>
                  <div className="text-xs text-gray-500">TX: {iface.tx}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${iface.status === 'running' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{iface.status}</span></td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleEditInterface(iface.name)} className="p-1.5 rounded-md text-blue-600 hover:bg-blue-100" title="Edit Interface"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteInterface(iface.name)} className="p-1.5 rounded-md text-red-600 hover:bg-red-100" title="Delete Interface"><Trash2 className="w-4 h-4" /></button>
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

export default NetworkInterfacesTable;