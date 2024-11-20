import React from 'react';
import { Link } from 'react-router-dom';

const QuestionCard = ({ question }) => {
  if (!question) {
    return null;
  }

  const { _id, title, asker, content, tags, createdAt } = question;

  console.log('question card ka question' , question)

  // Function to extract image URLs from content
  const extractImageUrl = (content) => {
    const imageMatch = content.match(/!\[.*?\]\((.*?)\)/);
    return imageMatch ? imageMatch[1] : null;
  };

  // Get image URL if exists
   const imageUrl = extractImageUrl(content);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Media Display */}
      {question.mediaUrls && question.mediaUrls.length > 0 && (
        <div className="mb-4">
          <img 
            src={question.mediaUrls[0].url} 
            alt={title}
            className="w-full h-48 object-cover rounded-lg mb-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      {/* Question Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600">
        <Link to={`/questions/${_id}`}>{title}</Link>
      </h2>
      
      {/* Author and Date */}
      <div className="text-sm text-gray-500 mb-2">
        Asked by <span className="font-medium text-gray-700">{asker}</span> on {new Date(createdAt).toLocaleDateString()}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {question.tags && Array.isArray(question.tags) ? question.tags.map((tag) => (
          <Link
            key={typeof tag === 'object' ? tag._id : tag}
            to={`/tags/${typeof tag === 'object' ? tag.name : tag}`}
            className="text-blue-500 hover:text-blue-700 text-sm mr-2"
          >
            #{typeof tag === 'object' ? tag.name : tag}
          </Link>
        )) : null}
      </div>

      {/* Question Excerpt - Remove image markdown from content display */}
      <p className="text-gray-700 mb-4">
        {content.replace(/!\[.*?\]\(.*?\)/g, '').substring(0, 100)}...
      </p>

      {/* View Question Button */}
      <Link
        to={`/questions/${_id}`}
        className="text-blue-500 hover:text-blue-600 font-semibold text-sm"
      >
        View Full Question →
      </Link>
    </div>
  );
};

export default QuestionCard;
