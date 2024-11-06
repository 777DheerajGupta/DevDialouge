import React from 'react';

const ChatMessage = ({ message, isOwnMessage }) => {
  return (
    <div className={`mb-4 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[70%] rounded-lg p-3 ${
          isOwnMessage 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100'
        }`}
      >
        <p className="break-words">{message.content}</p>
        <p className={`text-xs ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'} mt-1`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
