import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  if (!post) {
    return null;
  }

  const { _id, title, author, content, createdAt } = post;
  console.log('MediaUrls:', post.mediaUrls); // Debug log

  // Helper function to check media type
  const isVideoFile = (url) => {
    if (typeof url !== 'string') return false;
    return url.match(/\.(mp4|webm|ogg)$/i) !== null;
  };

  // Helper function to get media URL from mediaUrls array
  const getMediaUrl = () => {
    if (!post.mediaUrls || !Array.isArray(post.mediaUrls) || post.mediaUrls.length === 0) {
      return null;
    }
    // Assuming the media object has a url property
    const mediaObject = post.mediaUrls[0];
    return mediaObject.url || mediaObject.secure_url || mediaObject.path;
  };

  const mediaUrl = getMediaUrl();
  
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Media Display */}
      {mediaUrl && (
        <div className="w-full h-48 mb-4">
          {isVideoFile(mediaUrl) ? (
            <video className="w-full h-full object-cover rounded" controls>
              <source src={mediaUrl} type="video/mp4" />
            </video>
          ) : (
            <img 
              src={mediaUrl} 
              alt={title}
              className="w-full h-full object-cover rounded"
            />
          )}
        </div>
      )}
      
      {/* Existing Post Title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-2 hover:text-blue-600">
        <Link to={`/posts/${_id}`}>{title}</Link>
      </h2>
      
      {/* Author and Date */}
      <div className="text-sm text-gray-500 mb-2">
        By <span className="font-medium text-gray-700">
          {author?.name || 'Unknown Author'}
        </span> on {new Date(createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {post.tags && Array.isArray(post.tags) ? post.tags.map((tag) => (
          <Link
            key={typeof tag === 'object' ? tag._id : tag}
            to={`/tags/${typeof tag === 'object' ? tag.name : tag}`}
            className="text-blue-500 hover:text-blue-700 text-sm mr-2"
          >
            #{typeof tag === 'object' ? tag.name : tag}
          </Link>
        )) : null}
      </div>

      {/* Post Excerpt */}
      <p className="text-gray-700 mb-4">
        {post.content > 100 ? `${content.substring(0, 100)}...` : content}
      </p>

      {/* Read More Button */}
      <Link
        to={`/posts/${_id}`}
        className="text-blue-500 hover:text-blue-600 font-semibold text-sm"
      >
        Read More →
      </Link>
    </div>
  );
};

export default PostCard;
