import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    try {
      await updateProfile({ name, avatar });
      setSuccess(true);
    } catch (err) {
      setError('Failed to update profile');
    }
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button 
              onClick={handleBack}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span>Back</span>
            </button>
            <h1 className="text-lg font-medium text-gray-900">Profile Settings</h1>
            <div className="w-10"></div> {/* Empty div for alignment */}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <img 
                src={avatar || 'https://via.placeholder.com/150'} 
                alt={name} 
                className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <h2 className="mt-4 text-xl font-medium text-gray-900">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                  Avatar URL
                </label>
                <input
                  type="text"
                  id="avatar"
                  name="avatar"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              
              {success && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        Profile updated successfully!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;