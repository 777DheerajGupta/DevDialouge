import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  getPostById, 
  deletePost,
  updatePost,
  getPostComments,
  createPostComment,
  getAllTags,
  updateComment,
  deleteComment
} from '../services/postService';

// Add a Comment component with edit and delete functionality
const Comment = ({ comment, onDelete, onUpdate }) => {
  //  console.log('Comments is' , comment)
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!editedContent.trim()) return;
    
    try {
      setLoading(true);
      await onUpdate(comment._id, editedContent);
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      setLoading(true);
      await onDelete(comment._id);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <img
            src={comment.author?.profilePicture || '/defaultProfilePic.jpg'}
            alt={comment.author?.name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <div className="font-medium">{comment.author?.name || 'Anonymous'}</div>
            <div className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        {/* Comment Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-500 hover:text-blue-700 text-sm"
            disabled={loading}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-sm"
            disabled={loading}
          >
            Delete
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-2">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedContent(comment.content);
              }}
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700">{comment.content}</p>
      )}
    </div>
  );
};

// Add a CommentForm component
const CommentForm = ({ onSubmit, loading }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment..."
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
};

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Add newPost state
  const [newPost, setNewPost] = useState({
    media: null
  });
  
  // Existing states
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(new Set());

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsData = await getAllTags();
        console.log("tags data", tagsData);
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching tags:', error);
        toast.error('Failed to load tags');
      }
    };

    fetchTags();
  }, []);

  // Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postData = await getPostById(id);
        console.log("post data", postData);
        setPost(postData);
        setEditedTitle(postData.title);
        setEditedContent(postData.content);
        setSelectedTags(new Set(postData.tags.map(tag => tag._id)));
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error(error.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await getPostComments(id);
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast.error('Failed to load comments');
      }
    };

    if (id) {
      fetchComments();
    }
  }, [id]);

  // Handle post update
  const handleUpdatePost = async () => {
    if (!editedContent.trim() || !editedTitle.trim()) {
      toast.error('Title and content cannot be empty');
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData
      const formData = new FormData();
      formData.append('title', editedTitle);
      formData.append('content', editedContent);
      formData.append('tags', JSON.stringify(Array.from(selectedTags)));
      
      // Add media if exists
      if (newPost?.media) {
        formData.append('media', newPost.media);
      }

      console.log('Updating post with data:', {
        id,
        title: editedTitle,
        content: editedContent,
        tags: Array.from(selectedTags),
        hasMedia: !!newPost?.media
      });

      const response = await updatePost(id, formData);
      
      if (response.success) {
        setPost(response.data);
        setIsEditing(false);
        toast.success('Post updated successfully');
        // Instead of reloading, update the state
        setNewPost({ media: null });
      } else {
        throw new Error(response.message || 'Failed to update post');
      }
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(error.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  // Handle post deletion
  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setLoading(true);
      console.log('Attempting to delete post:', id);
      
      const result = await deletePost(id);
      
      if (result.success) {
        toast.success('Post deleted successfully');
        navigate('/');
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (content) => {
    try {
      setCommentLoading(true);
      const newComment = await createPostComment(id, { content });
      console.log( 'newComment' , newComment.success)
      
      // Ensure newComment contains author and createdAt fields
      if (newComment.success) {
        setComments(prevComments => [...prevComments, newComment.data]);
        toast.success('Comment posted successfully');
      } else {
        throw new Error('Comment data is incomplete');
      }
      
      // Optionally, you can reset the comment input here if needed
      // setComment(''); // Uncomment if you want to clear the input after submission
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error(error.message || 'Failed to post comment');
    } finally {
      setCommentLoading(false);
    }
  };

  // Add these new functions
  const handleCommentUpdate = async (commentId, content) => {
    try {
      const updatedComment = await updateComment(commentId, content);
      setComments(prevComments =>
        prevComments.map(comment =>
          comment._id === commentId ? { ...comment, content } : comment
        )
      );
      toast.success('Comment updated successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(prevComments =>
        prevComments.filter(comment => comment._id !== commentId)
      );
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Post not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {isEditing ? (
          <div className="mb-6">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full text-3xl font-bold mb-4 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Post Title"
            />
            
            {/* Media Upload Input - New Addition */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Media
              </label>
              <input
                type="file"
                name="media"
                accept="image/*,video/*"
                onChange={(e) => {
                  setNewPost(prev => ({
                    ...prev,
                    media: e.target.files[0]
                  }));
                }}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {/* Tags Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const isSelected = selectedTags.has(tag._id);
                  const isExistingTag = post.tags.some(postTag => postTag._id === tag._id);
                  
                  // If it's an existing tag, disable the button
                  if (isExistingTag && !isSelected) {
                    return (
                      <button
                        key={tag._id}
                        type="button"
                        disabled
                        className="px-3 py-1 rounded-full text-sm bg-gray-300 text-gray-500 cursor-not-allowed"
                      >
                        {tag.name} (Already added)
                      </button>
                    );
                  }

                  return (
                    <button
                      key={tag._id}
                      type="button"
                      onClick={() => {
                        setSelectedTags(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(tag._id)) {
                            newSet.delete(tag._id);
                          } else {
                            newSet.add(tag._id);
                          }
                          return newSet;
                        });
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        isSelected
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[200px]"
              placeholder="Post Content"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleUpdatePost}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedTitle(post.title);
                  setEditedContent(post.content);
                  setNewPost({ media: null }); // Reset the media state
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            
            {/* Media Display - New Addition */}
            {post.mediaUrls && post.mediaUrls.length > 0 && (
              <div className="mb-6">
                {post.mediaUrls[0].type === 'video' ? (
                  <video 
                    className="w-full rounded-lg max-h-[500px] object-contain"
                    controls
                  >
                    <source src={post.mediaUrls[0].url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={post.mediaUrls[0].url}
                    alt={post.title}
                    className="w-full rounded-lg max-h-[500px] object-contain"
                  />
                )}
              </div>
            )}

            <div className="prose max-w-none mb-6">
              {post.content}
            </div>
            <div className="flex gap-4 mb-8 text-sm">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:underline"
              >
                Edit Post
              </button>
              <button
                onClick={handleDeletePost}
                className="text-red-500 hover:underline"
              >
                Delete Post
              </button>
            </div>
            {/* Fix the Tags Display in view mode */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags?.map((tag) => {
                // Debug log
                console.log('View mode tag:', tag);
                
                return (
                  <span
                    key={tag._id}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag.name}
                  </span>
                );
              })}
            </div>
          </>
        )}

        {/* Post Metadata */}
        <div className="flex items-center mb-6">
          <img 
            src={post.author?.profilePicture || '/defaultProfilePic.jpg'}
            alt={post.author?.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <div className="font-medium">{post.author?.name}</div>
            <div className="text-sm text-gray-500">
              Posted on {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Comments ({comments.length})
        </h2>

        {/* Comment Form */}
        <CommentForm 
          onSubmit={handleCommentSubmit}
          loading={commentLoading}
        />

        {/* Comments List */}
        <div className="mt-6">
          {comments.length > 0 ? (
            comments.map(comment => (
              <Comment
                key={comment._id}
                comment={comment}
                onUpdate={handleCommentUpdate}
                onDelete={handleCommentDelete}
              />
            ))
          ) : (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;