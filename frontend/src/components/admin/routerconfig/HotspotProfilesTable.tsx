import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Profile } from '../RouterConfig'; // Import Profile type from RouterConfig

interface HotspotProfilesTableProps {
  profiles: Profile[];
  setIsAddProfileModalOpen: (isOpen: boolean) => void;
  handleEditProfile: (profileName: string) => void;
  handleDeleteProfile: (profileName: string) => void;
}

const HotspotProfilesTable: React.FC<HotspotProfilesTableProps> = ({
  profiles,
  setIsAddProfileModalOpen,
  handleEditProfile,
  handleDeleteProfile,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Hotspot Profiles</h3>
        <button 
          onClick={() => setIsAddProfileModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 text-sm"
        >
          <Plus className="w-4 h-4" /><span>Add Profile</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <div key={profile.name} className="border rounded-lg p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-gray-800">{profile.name}</h4>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${profile.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{profile.status}</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600 flex-grow">
              <div className="flex justify-between"><span>Session Timeout:</span> <span className="font-medium text-gray-800">{profile.sessionTimeout}</span></div>
              <div className="flex justify-between"><span>Idle Timeout:</span> <span className="font-medium text-gray-800">{profile.idleTimeout}</span></div>
              <div className="flex justify-between"><span>Shared Users:</span> <span className="font-medium text-gray-800">{profile.sharedUsers}</span></div>
              <div className="flex justify-between"><span>Rate Limit:</span> <span className="font-medium text-gray-800">{profile.rateLimit}</span></div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => handleEditProfile(profile.name)} className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100">Edit</button>
              <button onClick={() => handleDeleteProfile(profile.name)} className="px-3 py-1 border border-red-500 text-red-500 rounded-md text-sm hover:bg-red-50">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotspotProfilesTable;