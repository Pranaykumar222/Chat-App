import React, { useContext, useEffect, useState } from 'react';
import { userService } from '../../services/api';
import ChatContext from '../../context/ChatContext';

const UserList = ({ onlineUsers }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { createChat } = useContext(ChatContext);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await userService.getAllUsers();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  const handleUserClick = async (userId) => {
    try {
      await createChat(userId);
    } catch (err) {
      console.error('Failed to create chat:', err);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        {error}
      </div>
    );
  }
  
  if (users.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No users found
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      {users.map(user => {
        const isOnline = onlineUsers[user._id] === 'online';
        
        return (
          <div 
            key={user._id}
            onClick={() => handleUserClick(user._id)}
            className="flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${
                isOnline ? 'bg-green-500' : 'bg-gray-300'
              }`}></span>
            </div>
            
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">
                {user.name}
              </h3>
              <p className="text-xs text-gray-500">
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserList;