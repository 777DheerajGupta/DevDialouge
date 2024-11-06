import React from 'react';

const CommentCard = ({ comment }) => {
  const { author, content, createdAt } = comment;

  return (
    <div className="bg-gray-100 shadow-md rounded-lg p-4 mb-4 border border-gray-200">
      
      {/* Comment Content */}
      <p className="text-gray-800 mb-2">{content}</p>
      
      {/* Author and Date */}
      <div className="text-sm text-gray-500">
        Commented by <span className="font-medium text-gray-700">{author.name}</span> on {new Date(createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default CommentCard;
