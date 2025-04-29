import React from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/chat/ChatWindow';

const Home = () => {
  return (
    <div className="h-screen flex">
      {/* Sidebar - fixed width on mobile, 1/3 width on larger screens */}
      <div className="w-full md:w-1/3 lg:w-80 border-r border-gray-200">
        <ChatSidebar />
      </div>
      
      {/* Main chat area - hidden on mobile when no chat is selected */}
      <div className="hidden md:block md:flex-1">
        <ChatWindow />
      </div>
    </div>
  );
};

export default Home;