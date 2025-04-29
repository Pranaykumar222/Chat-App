import React, { createContext, useState, useEffect, useContext } from 'react';
import { chatService, messageService } from '../services/api';
import { AuthContext } from './AuthContext';
import { SocketContext } from './SocketContext';

// Create the Chat Context
export const ChatContext = createContext();

// Chat Provider Component
export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  // Fetch all chats
  const fetchChats = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data } = await chatService.getChats();
      setChats(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch chats');
      setLoading(false);
    }
  };

  // Create a new chat
  const createChat = async (userId) => {
    try {
      setLoading(true);
      const { data } = await chatService.createChat(userId);
      setChats((prev) => [data, ...prev.filter(c => c._id !== data._id)]);
      setSelectedChat(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError('Failed to create chat');
      setLoading(false);
      throw err;
    }
  };

  // Select a chat
  const selectChat = async (chat) => {
    setSelectedChat(chat);
    
    // Join socket room
    if (socket && chat) {
      socket.emit('join-chat', chat._id);
    }
    
    // Fetch messages
    if (chat) {
      try {
        setLoading(true);
        const { data } = await messageService.getMessages(chat._id);
        setMessages(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch messages');
        setLoading(false);
      }
    }
  };

  // Send a message
  const sendMessage = async (content) => {
    if (!selectedChat) return;
    
    try {
      const { data } = await messageService.sendMessage(selectedChat._id, content);
      setMessages((prev) => [...prev, data]);
      
      // Update latest message in chat list
      setChats((prev) => 
        prev.map((c) => 
          c._id === selectedChat._id 
            ? { ...c, latestMessage: data } 
            : c
        )
      );
      
      // Emit socket event
      if (socket) {
        socket.emit('new-message', data);
      }
      
      return data;
    } catch (err) {
      setError('Failed to send message');
      throw err;
    }
  };

  // Mark message as read
  const markMessageAsRead = async (messageId) => {
    try {
      const { data } = await messageService.markAsRead(messageId);
      
      // Update message in state
      setMessages((prev) => 
        prev.map((msg) => 
          msg._id === messageId 
            ? { ...msg, readBy: data.readBy } 
            : msg
        )
      );
      
      // Emit socket event
      if (socket && selectedChat) {
        socket.emit('message-read', {
          messageId,
          chatId: selectedChat._id,
          reader: user._id
        });
      }
      
      return data;
    } catch (err) {
      console.error('Mark as read error:', err);
    }
  };

  // Socket event handlers
  useEffect(() => {
    if (socket) {
      // Handle new message received
      socket.on('message-received', (newMessage) => {
        // Update messages array if in the selected chat
        if (selectedChat && selectedChat._id === newMessage.chat._id) {
          setMessages((prev) => [...prev, newMessage]);
          // Mark message as read
          markMessageAsRead(newMessage._id);
        }
        
        // Update chats list with latest message
        setChats((prev) => 
          prev.map((c) => 
            c._id === newMessage.chat._id 
              ? { ...c, latestMessage: newMessage } 
              : c
          )
        );
      });
      
      // Handle message read update
      socket.on('message-read-update', ({ messageId, readBy }) => {
        setMessages((prev) => 
          prev.map((msg) => 
            msg._id === messageId 
              ? { ...msg, readBy: [...msg.readBy, readBy] } 
              : msg
          )
        );
      });
      
      return () => {
        socket.off('message-received');
        socket.off('message-read-update');
      };
    }
  }, [socket, selectedChat]);

  // Initial fetch of chats
  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        selectedChat,
        messages,
        loading,
        error,
        fetchChats,
        createChat,
        selectChat,
        sendMessage,
        markMessageAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;