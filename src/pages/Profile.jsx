import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiGlobe, 
  FiTwitter, 
  FiGithub, 
  FiLinkedin,
  FiUpload,
  FiSave,
  FiCheck,
  FiX,
  FiEye,
  FiEyeOff,
  FiBell,
  FiCreditCard,
  FiShield,
  FiTrash2,
  FiSettings
} from 'react-icons/fi';

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Form states
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    website: '',
    twitter: '',
    github: '',
    linkedin: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    courseUpdates: true,
    marketingEmails: false,
    privateAccount: false,
    showOnlineStatus: true
  });

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        website: user.website || '',
        twitter: user.twitter || '',
        github: user.github || '',
        linkedin: user.linkedin || ''
      });
      
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingsChange = (name) => {
    setSettings(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      // In a real app, you would upload the avatar and update the profile
      const updatedData = { ...profileData };
      
      if (avatarFile) {
        // Simulate avatar upload
        await new Promise(resolve => setTimeout(resolve, 1000));
        updatedData.avatar = avatarPreview; // In a real app, this would be the URL from your storage
      }

      // Update profile in context
      await updateProfile(updatedData);
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      // In a real app, you would verify the current password and update it
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      
      setSuccessMessage('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // In a real app, you would call an API to delete the account
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Logout and redirect would be handled by the AuthContext
      } catch (err) {
        setError('Failed to delete account. Please try again.');
      }
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-slate-700 overflow-hidden">
            {avatarPreview ? (
              <img 
                src={avatarPreview} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-600 text-4xl text-white">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
            <FiUpload size={16} />
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
        <h2 className="text-2xl font-bold mt-4">{user?.name || 'User'}</h2>
        <p className="text-gray-400">{user?.email}</p>
      </div>

      {!isEditing ? (
        <div className="space-y-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Full Name</p>
                <p className="text-white">{profileData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white">{profileData.email}</p>
              </div>
              {profileData.bio && (
                <div>
                  <p className="text-sm text-gray-400">Bio</p>
                  <p className="text-white">{profileData.bio}</p>
                </div>
              )}
            </div>
          </div>

          {(profileData.website || profileData.twitter || profileData.github || profileData.linkedin) && (
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Social Links</h3>
              <div className="flex space-x-4">
                {profileData.website && (
                  <a 
                    href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <FiGlobe size={20} />
                  </a>
                )}
                {profileData.twitter && (
                  <a 
                    href={`https://twitter.com/${profileData.twitter}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <FiTwitter size={20} />
                  </a>
                )}
                {profileData.github && (
                  <a 
                    href={`https://github.com/${profileData.github}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white"
                  >
                    <FiGithub size={20} />
                  </a>
                )}
                {profileData.linkedin && (
                  <a 
                    href={profileData.linkedin.startsWith('http') ? profileData.linkedin : `https://linkedin.com/in/${profileData.linkedin}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-400"
                  >
                    <FiLinkedin size={20} />
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-md text-white font-medium"
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="bg-slate-800 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleProfileChange}
                rows="3"
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">Social Links</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Website</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md bg-slate-700 text-gray-300 border border-r-0 border-slate-600">
                  https://
                </span>
                <input
                  type="text"
                  name="website"
                  value={profileData.website}
                  onChange={handleProfileChange}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="yourwebsite.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Twitter</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md bg-slate-700 text-gray-300 border border-r-0 border-slate-600">
                    @
                  </span>
                  <input
                    type="text"
                    name="twitter"
                    value={profileData.twitter}
                    onChange={handleProfileChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">GitHub</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md bg-slate-700 text-gray-300 border border-r-0 border-slate-600">
                    github.com/
                  </span>
                  <input
                    type="text"
                    name="github"
                    value={profileData.github}
                    onChange={handleProfileChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="username"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">LinkedIn</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md bg-slate-700 text-gray-300 border border-r-0 border-slate-600">
                    linkedin.com/in/
                  </span>
                  <input
                    type="text"
                    name="linkedin"
                    value={profileData.linkedin}
                    onChange={handleProfileChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                // Reset form if needed
              }}
              className="px-4 py-2 border border-gray-600 hover:bg-slate-800 rounded-md text-white font-medium"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-md text-white font-medium flex items-center"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
              {!isSaving && <FiSave className="ml-2" />}
            </button>
          </div>
        </form>
      )}
    </div>
  );

  const renderPasswordTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold">Change Password</h3>
        
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 pl-3 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                {showCurrentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 pl-3 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-400">Must be at least 6 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 pl-3 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-md text-white font-medium flex items-center"
              disabled={isSaving}
            >
              {isSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-lg space-y-6">
        <h3 className="text-lg font-semibold">Notification Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Email Notifications</h4>
              <p className="text-sm text-gray-400">Receive email notifications about your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.emailNotifications}
                onChange={() => handleSettingsChange('emailNotifications')}
              />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Course Updates</h4>
              <p className="text-sm text-gray-400">Get updates about courses you're enrolled in</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.courseUpdates}
                onChange={() => handleSettingsChange('courseUpdates')}
              />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Marketing Emails</h4>
              <p className="text-sm text-gray-400">Receive emails about new courses and offers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.marketingEmails}
                onChange={() => handleSettingsChange('marketingEmails')}
              />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg space-y-6">
        <h3 className="text-lg font-semibold">Privacy Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Private Account</h4>
              <p className="text-sm text-gray-400">Make your profile and courses private</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.privateAccount}
                onChange={() => handleSettingsChange('privateAccount')}
              />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Show Online Status</h4>
              <p className="text-sm text-gray-400">Show when you're online</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.showOnlineStatus}
                onChange={() => handleSettingsChange('showOnlineStatus')}
              />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
        
        <div className="border border-red-500/30 rounded-lg p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h4 className="font-medium text-white">Delete Account</h4>
              <p className="text-sm text-gray-400">Permanently delete your account and all associated data</p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="mt-4 md:mt-0 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-md font-medium transition-colors"
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-gray-400 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'}`}
            >
              <div className="flex items-center">
                <FiUser className="mr-2" />
                Profile
              </div>
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'password' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'}`}
            >
              <div className="flex items-center">
                <FiLock className="mr-2" />
                Password
              </div>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'settings' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'}`}
            >
              <div className="flex items-center">
                <FiSettings className="mr-2" />
                Settings
              </div>
            </button>
          </nav>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-md flex items-center">
            <FiCheckCircle className="mr-2 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-md flex items-center">
            <FiX className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'password' && renderPasswordTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
