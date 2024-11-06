import React from 'react';

const FollowRequestCard = ({ request, onAccept, onReject }) => {
  const { user } = request;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200 hover:shadow-lg transition-shadow">
      
      {/* User Information */}
      <div className="flex items-center mb-3">
        <img
          src={user.profilePicture || '/default-profile.png'}
          alt={`${user.name}'s profile`}
          className="w-10 h-10 rounded-full mr-3"
        />
        <span className="text-gray-800 font-semibold">{user.name}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => onAccept(user.id)}
          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
        >
          Accept
        </button>
        <button
          onClick={() => onReject(user.id)}
          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default FollowRequestCard;
