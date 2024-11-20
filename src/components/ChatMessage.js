import React from 'react';

const ChatMessage = ({ message, isOwnMessage }) => {
  //  console.log('messages' , message)
  return (
    <div className={`mb-4 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[70%] rounded-lg p-3 ${
          isOwnMessage 
            ? 'bg-green-500 text-white' 
            : 'bg-yellow-100'
        }`}
      >
        <p className="font-bold">{message.sender.name}</p>
        <p className="break-words">{message.content}</p>
        <p className={`text-xs ${isOwnMessage ? 'text-green-100' : 'text-gray-500'} mt-1`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
