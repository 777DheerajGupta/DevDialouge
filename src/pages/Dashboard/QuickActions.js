import React from 'react';
import { Link } from 'react-router-dom';
import { ChatBubbleLeftIcon, PencilIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const QuickActions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Create Post Card */}
      <Link to="/create-post" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
        <PencilIcon className="w-8 h-8 text-blue-500 mb-3" />
        <h3 className="font-semibold mb-2">Create Post</h3>
        <p className="text-gray-600 text-sm">Share your thoughts with the community</p>
      </Link>

      {/* Ask Question Card */}
      <Link to="/ask-question" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
        <QuestionMarkCircleIcon className="w-8 h-8 text-green-500 mb-3" />
        <h3 className="font-semibold mb-2">Ask Question</h3>
        <p className="text-gray-600 text-sm">Get help from the community</p>
      </Link>

      {/* Chat Card */}
      <Link to="/chat" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
        <ChatBubbleLeftIcon className="w-8 h-8 text-purple-500 mb-3" />
        <h3 className="font-semibold mb-2">Messages</h3>
        <p className="text-gray-600 text-sm">Chat with other members</p>
      </Link>
    </div>
  );
};

export default QuickActions; 