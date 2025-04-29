import React from 'react';
import { MessageSquare } from 'lucide-react';

const EmptyChatWindow = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
        <MessageSquare size={32} className="text-indigo-600" />
      </div>
      <h2 className="text-xl font-medium text-gray-800 mb-2">Welcome to ChatApp</h2>
      <p className="text-gray-500 max-w-md mb-6">
        Select a conversation from the sidebar or start a new chat by selecting a user from the Users tab.
      </p>
      <div className="w-full max-w-xs p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-2">Getting Started</h3>
        <ul className="text-left text-sm text-gray-600 space-y-2">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-100 text-indigo-600 text-xs mr-2 mt-0.5">1</span>
            <span>Select the Users tab in the sidebar</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-100 text-indigo-600 text-xs mr-2 mt-0.5">2</span>
            <span>Click on a user to start a conversation</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-100 text-indigo-600 text-xs mr-2 mt-0.5">3</span>
            <span>Type your message and press Enter to send</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EmptyChatWindow;