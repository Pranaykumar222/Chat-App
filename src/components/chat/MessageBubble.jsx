import React from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

const MessageBubble = ({ message, isOwnMessage }) => {
  const formatTime = (timestamp) => {
    return format(new Date(timestamp), 'h:mm a');
  };
  
  const readByOthers = message.readBy && message.readBy.length > 1;
  
  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
          isOwnMessage
            ? 'bg-indigo-600 text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
        }`}
      >
        <div className="break-words">
          {message.content}
        </div>
        <div
          className={`text-xs mt-1 flex justify-end items-center ${
            isOwnMessage ? 'text-indigo-200' : 'text-gray-500'
          }`}
        >
          <span className="mr-1">{formatTime(message.createdAt)}</span>
          
          {isOwnMessage && (
            <span className="ml-1">
              {readByOthers ? (
                <CheckCheck size={16} className="text-teal-300" />
              ) : (
                <Check size={16} />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;