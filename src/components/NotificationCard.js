import React from 'react';

const NotificationCard = ({ notification }) => {
  const { message, user, createdAt } = notification;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200 hover:shadow-lg transition-shadow">
      
      {/* Notification Message */}
      <p className="text-gray-800 mb-2">{message}</p>
      
      {/* User and Date */}
      <div className="text-sm text-gray-500">
        <span className="font-medium text-gray-700">{user.name}</span> - {new Date(createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default NotificationCard;
