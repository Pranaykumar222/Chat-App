import React, { useContext, useState, useEffect, useRef } from 'react';
import { Send, Smile, Paperclip, MoreVertical } from 'lucide-react';
import ChatContext from '../../context/ChatContext';
import SocketContext from '../../context/SocketContext';
import AuthContext from '../../context/AuthContext';
import MessageList from './MessageList';
import EmptyChatWindow from './EmptyChatWindow';
import TypingIndicator from './TypingIndicator';

const ChatWindow = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { selectedChat, messages, sendMessage } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const { startTyping, stopTyping, isTyping: isSomeoneTyping } = useContext(SocketContext);
  const typingTimeoutRef = useRef(null);
  const sendButtonRef = useRef(null);
  
  // Get the other user in the chat
  const getOtherUser = () => {
    if (!selectedChat || !user) return null;
    return selectedChat.users.find(u => u._id !== user._id);
  };
  
  const otherUser = getOtherUser();
  
  // Handle typing indicators
  useEffect(() => {
    if (message && !isTyping && selectedChat) {
      setIsTyping(true);
      startTyping(selectedChat._id);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping && selectedChat) {
        setIsTyping(false);
        stopTyping(selectedChat._id);
      }
    }, 3000);
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, isTyping, selectedChat]);
  
  // Handle message submission
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedChat) return;
    
    try {
      await sendMessage(message.trim());
      setMessage('');
      setIsTyping(false);
      if (selectedChat) {
        stopTyping(selectedChat._id);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };
  
  // Handle keydown (Enter to send)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendButtonRef.current.click();
    }
  };
  
  if (!selectedChat) {
    return <EmptyChatWindow />;
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${
              otherUser && otherUser.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
            }`}></span>
          </div>
          <div className="ml-3">
            <h2 className="text-sm font-medium text-gray-900">{otherUser?.name || 'User'}</h2>
            <p className="text-xs text-gray-500">
              {otherUser && otherUser.status === 'online' ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>
      
      {/* Message list */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <MessageList messages={messages} currentUser={user} />
      </div>
      
      {/* Typing indicator */}
      {selectedChat && isSomeoneTyping(selectedChat._id) && (
        <div className="px-4 py-2">
          <TypingIndicator name={otherUser?.name || 'User'} />
        </div>
      )}
      
      {/* Message input */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-end">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Paperclip size={20} />
          </button>
          <div className="flex-1 mx-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows="1"
            ></textarea>
          </div>
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Smile size={20} />
          </button>
          <button
            ref={sendButtonRef}
            type="submit"
            disabled={!message.trim()}
            className={`ml-2 p-2 rounded-full text-white ${
              message.trim() ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-400 cursor-not-allowed'
            } transition-colors`}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;