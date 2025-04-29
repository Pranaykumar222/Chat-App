import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

// Create the Socket Context
export const SocketContext = createContext();

// Socket Provider Component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [typing, setTyping] = useState({});
  const { user } = useContext(AuthContext);

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      // Connect to socket server
      const newSocket = io('http://localhost:5123');
      setSocket(newSocket);
      
      // Cleanup on unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  // Set up socket event listeners
  useEffect(() => {
    if (socket && user) {
      // Setup user
      socket.emit('setup', user);
      
      // Handle connected
      socket.on('connected', () => {
        console.log('Socket connected');
      });
      
      // Update online users
      socket.on('user-status-update', ({ userId, status }) => {
        setOnlineUsers((prev) => ({
          ...prev,
          [userId]: status
        }));
      });
      
      // Typing indicators
      socket.on('typing', (chatId) => {
        setTyping((prev) => ({
          ...prev,
          [chatId]: true
        }));
      });
      
      socket.on('stop-typing', (chatId) => {
        setTyping((prev) => ({
          ...prev,
          [chatId]: false
        }));
      });
      
      return () => {
        socket.off('connected');
        socket.off('user-status-update');
        socket.off('typing');
        socket.off('stop-typing');
      };
    }
  }, [socket, user]);

  // Typing indicator functions
  const startTyping = (chatId) => {
    if (socket && chatId) {
      socket.emit('typing', chatId);
    }
  };
  
  const stopTyping = (chatId) => {
    if (socket && chatId) {
      socket.emit('stop-typing', chatId);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        isTyping: (chatId) => typing[chatId] || false,
        startTyping,
        stopTyping
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;