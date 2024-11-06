import React from 'react';
import { Link } from 'react-router-dom';

function ActivityFeed({ posts = [], questions = [] }) {
  // Ensure posts and questions are arrays
  const postsArray = Array.isArray(posts) ? posts : [];
  const questionsArray = Array.isArray(questions) ? questions : [];

  // Combine and sort posts and questions by date
  const activities = [
    ...postsArray.map(post => ({
      ...post,
      type: 'post',
      uniqueId: `post-${post._id}`
    })),
    ...questionsArray.map(question => ({
      ...question,
      type: 'question',
      uniqueId: `question-${question._id}`
    }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Activity Feed</h2>
      
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div 
              key={activity.uniqueId} 
              className="border-b pb-4 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  {activity.user?.avatar ? (
                    <img 
                      src={activity.user.avatar} 
                      alt={activity.user?.name || 'User'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      {activity.user?.name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-gray-800">
                    <span className="font-semibold">
                      {activity.user?.name || 'Unknown User'}
                    </span>
                    {activity.type === 'post' ? (
                      <Link 
                        to={`/posts/${activity._id}`}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        {' created a new post'}
                      </Link>
                    ) : (
                      <Link 
                        to={`/questions/${activity._id}`}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        {' asked a question'}
                      </Link>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    })}
                  </p>
                  {activity.title && (
                    <p className="text-gray-800 mt-2 font-medium">
                      {activity.title}
                    </p>
                  )}
                  {activity.content && (
                    <p className="text-gray-600 mt-1 line-clamp-2">
                      {activity.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No recent activity</p>
            <div className="mt-4 space-x-4">
              <Link
                to="/posts/create"
                className="text-blue-500 hover:text-blue-600"
              >
                Create a Post
              </Link>
              <Link
                to="/questions/ask"
                className="text-blue-500 hover:text-blue-600"
              >
                Ask a Question
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityFeed; 