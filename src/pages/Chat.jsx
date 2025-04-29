import React, { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ChatContext from '../context/ChatContext';
import ChatWindow from '../components/chat/ChatWindow';

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { chats, selectedChat, selectChat } = useContext(ChatContext);
  
  // Select chat when component mounts or id changes
  useEffect(() => {
    const chat = chats.find((c) => c._id === id);
    if (chat) {
      selectChat(chat);
    }
  }, [id, chats]);
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <div className="h-screen flex flex-col">
      {/* Mobile header - only visible on small screens */}
      <div className="md:hidden p-3 border-b border-gray-200 bg-white">
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-700"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Back</span>
        </button>
      </div>
      
      {/* Chat window */}
      <div className="flex-1">
        <ChatWindow />
      </div>
    </div>
  );
};

export default Chat;