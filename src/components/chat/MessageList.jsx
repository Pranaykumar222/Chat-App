import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, currentUser }) => {
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt);
      const dateString = format(date, 'MMMM d, yyyy');
      
      if (!groups[dateString]) {
        groups[dateString] = [];
      }
      
      groups[dateString].push(message);
    });
    
    return groups;
  };
  
  const messageGroups = groupMessagesByDate(messages);
  
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-700">No messages yet</h3>
        <p className="text-sm text-gray-500 mt-1">Start the conversation by sending a message</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 space-y-6">
      {Object.entries(messageGroups).map(([date, msgs]) => (
        <div key={date}>
          <div className="flex justify-center mb-4">
            <span className="px-3 py-1 text-xs bg-gray-200 rounded-full text-gray-500">
              {date}
            </span>
          </div>
          
          <div className="space-y-3">
            {msgs.map(message => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwnMessage={message.sender._id === currentUser?._id}
              />
            ))}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;