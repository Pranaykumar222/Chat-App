import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, User, Settings, LogOut } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import ChatContext from '../context/ChatContext';
import SocketContext from '../context/SocketContext';
import ChatList from './chat/ChatList';
import UserList from './user/UserList';

const ChatSidebar = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const { user, logout } = useContext(AuthContext);
  const { chats, selectedChat, selectChat } = useContext(ChatContext);
  const { onlineUsers } = useContext(SocketContext);
  const navigate = useNavigate();
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleLogout = () => {
    logout();
  };
  
  const handleProfileClick = () => {
    navigate('/profile');
  };
  
  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-600">ChatApp</h1>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleProfileClick}
              className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Settings size={20} />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 font-medium text-sm ${
            activeTab === 'chats'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabChange('chats')}
        >
          <div className="flex items-center justify-center">
            <MessageSquare size={18} className="mr-2" />
            Chats
          </div>
        </button>
        <button
          className={`flex-1 py-3 font-medium text-sm ${
            activeTab === 'users'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabChange('users')}
        >
          <div className="flex items-center justify-center">
            <User size={18} className="mr-2" />
            Users
          </div>
        </button>
      </div>
      
      {/* Search bar */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder={activeTab === 'chats' ? 'Search chats...' : 'Search users...'}
            className="w-full p-2 pl-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chats' ? (
          <ChatList 
            chats={chats} 
            selectedChat={selectedChat}
            onSelectChat={selectChat}
            onlineUsers={onlineUsers}
          />
        ) : (
          <UserList onlineUsers={onlineUsers} />
        )}
      </div>
      
      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        {user && (
          <div className="flex items-center">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${
                onlineUsers[user._id] === 'online' ? 'bg-green-500' : 'bg-gray-300'
              }`}></span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user.name}</p>
              <p className="text-xs text-gray-500">{onlineUsers[user._id] === 'online' ? 'Online' : 'Offline'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;