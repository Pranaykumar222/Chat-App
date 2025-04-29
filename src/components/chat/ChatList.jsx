import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const ChatList = ({ chats, selectedChat, onSelectChat, onlineUsers, currentUserId }) => {
  // Function to get the sender user in a 1:1 chat
  const getOtherUser = (chat) => {
    return chat.users.find(user => user._id === currentUserId);
  };
  
  // Format timestamp 
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };
  
  // Truncate message content
  const truncateMessage = (content, maxLength = 30) => {
    if (!content) return '';
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };
  
  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-md font-medium text-gray-700">No conversations yet</h3>
        <p className="text-sm text-gray-500 mt-1">Start chatting with someone from the Users tab</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      {chats.map(chat => {
        const otherUser = getOtherUser(chat);
        const isSelected = selectedChat && selectedChat._id === chat._id;
        const isOnline = otherUser && onlineUsers[otherUser._id] === 'online';
        
        return (
          <div 
            key={chat._id}
            onClick={() => onSelectChat(chat)}
            className={`flex items-center p-3 cursor-pointer transition-colors ${
              isSelected
                ? 'bg-indigo-50'
                : 'hover:bg-gray-50'
            }`}
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
            
            <div className="ml-3 flex-1 overflow-hidden">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {otherUser?.name || 'Unknown User'}
                </h3>
                {chat.latestMessage && (
                  <span className="text-xs text-gray-500">
                    {formatTime(chat.latestMessage.createdAt)}
                  </span>
                )}
              </div>
              
              <div className="flex items-center">
                <p className="text-sm text-gray-500 truncate">
                  {chat.latestMessage ? truncateMessage(chat.latestMessage.content) : 'No messages yet'}
                </p>
                
                {chat.latestMessage && !chat.latestMessage.readBy.includes('currentUserId') && (
                  <span className="ml-2 flex-shrink-0 inline-block h-2 w-2 rounded-full bg-indigo-600"></span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;