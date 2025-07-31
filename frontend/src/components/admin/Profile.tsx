import React, { useState, useEffect } from 'react';
import { User, Lock, Save, Eye, EyeOff, RotateCcw } from 'lucide-react'; // Import RotateCcw
import Layout from './Layout';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user, updateUser, resetAuth } = useAuth(); // Get resetAuth

  const [profile, setProfile] = useState({
    username: '',
    email: ''
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username,
        email: user.email
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Update profile info
    updateUser(user.id, { username: profile.username, email: profile.email });
    toast.success('Profile information updated!');

    // Check if user wants to change password
    if (passwords.newPassword) {
      if (!passwords.currentPassword) {
        toast.error('Please enter your current password to set a new one.');
        return;
      }
      if (passwords.newPassword !== passwords.confirmPassword) {
        toast.error('New passwords do not match!');
        return;
      }
      
      // In a real app, you'd verify the current password.
      // Here we just update it.
      updateUser(user.id, { password: passwords.newPassword });
      toast.success('Password changed successfully!');
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const handleResetAccount = () => {
    if (window.confirm('Are you sure you want to reset all admin accounts to default (admin/admin)? This will log you out.')) {
      resetAuth();
      // No need to navigate here, AuthContext's onAuthStateChange will handle logout and redirect
    }
  };

  if (!user) {
    return <Layout><div>Loading profile...</div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
            <p className="text-gray-600">Manage your account settings and security</p>
          </div>
          {user.role === 'super_admin' && (
            <button
              onClick={handleResetAccount}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Admin Accounts</span>
            </button>
          )}
        </div>

        {/* Combined Profile and Password Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSaveChanges}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
              {/* Profile Information Section */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Change Password Section */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <Lock className="w-5 h-5 text-red-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Leave blank to keep current"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Save Button */}
            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Save All Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;