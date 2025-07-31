import React from 'react';
import { Clock, Users, ArrowLeftRight, DatabaseBackup, RotateCcw, Power } from 'lucide-react';

interface RouterStatusOverviewProps {
  handleBackup: () => void;
  handleRestartHotspot: () => void;
  handleReboot: () => void;
}

const RouterStatusOverview: React.FC<RouterStatusOverviewProps> = ({
  handleBackup,
  handleRestartHotspot,
  handleReboot,
}) => {
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
          <h3 className="text-base font-semibold text-blue-600 uppercase tracking-wider">Connection Status</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-green-600">Connected</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex items-center justify-center space-x-4 p-4">
            <Clock className="w-10 h-10 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Uptime</p>
              <p className="text-xl font-bold text-gray-800">2d 14h 32m</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4 p-4">
            <Users className="w-10 h-10 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-xl font-bold text-gray-800">89</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4 p-4">
            <ArrowLeftRight className="w-10 h-10 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Bandwidth Usage</p>
              <p className="text-xl font-bold text-gray-800">67 Mbps / 100 Mbps</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Router Status & Management</h3>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <button onClick={handleBackup} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 text-sm"><DatabaseBackup className="w-4 h-4" /><span>Backup</span></button>
            <button onClick={handleRestartHotspot} className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-orange-600 text-sm"><RotateCcw className="w-4 h-4" /><span>Restart Hotspot</span></button>
            <button onClick={handleReboot} className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 text-sm"><Power className="w-4 h-4" /><span>Reboot</span></button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">CPU Usage</span>
              <span className="text-sm font-bold text-blue-600">23%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: '23%' }}></div></div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">Memory Usage</span>
              <span className="text-sm font-bold text-green-600">45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div></div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">Temperature</span>
              <span className="text-sm font-bold text-orange-600">42°C</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-orange-500 h-2 rounded-full" style={{ width: '42%' }}></div></div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">Disk Usage</span>
              <span className="text-sm font-bold text-purple-600">12%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-purple-600 h-2 rounded-full" style={{ width: '12%' }}></div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RouterStatusOverview;