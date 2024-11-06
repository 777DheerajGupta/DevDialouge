import React, { useEffect, useState } from 'react';
import { apiConnector } from '../api/apiConnector';
import { toast } from 'react-toastify';
import PostCard from '../components/PostCard';

const PostPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: '',
    media: null
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await apiConnector('GET', '/posts/');
      // console.log('post response', response.data.data);
      if (response.data.success) {
        setPosts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts!');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'media') {
      setNewPost(prev => ({
        ...prev,
        media: files[0]
      }));
    } else {
      setNewPost(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = newPost.tags
        ? newPost.tags.split(',').map(tag => tag.trim())
        : [];

      const formData = new FormData();
      formData.append('title', newPost.title);
      formData.append('content', newPost.content);
      formData.append('tags', JSON.stringify(tagsArray));
      if (newPost.media) {
        formData.append('media', newPost.media);
      }

      const response = await apiConnector('POST', '/posts/', formData, true);
      
      console.log('Response from server:', response.data);
      
      if (response.data.success) {
        setPosts(prev => [response.data.data, ...prev]);
        setNewPost({ title: '', content: '', tags: '', media: null });
        toast.success('Post created successfully!');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post!');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Posts</h1>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow-md">
        <h2 className="text-2xl mb-2">Create a New Post</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newPost.title}
          onChange={handleInputChange}
          required
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          name="content"
          placeholder="Content"
          value={newPost.content}
          onChange={handleInputChange}
          required
          className="w-full p-2 mb-2 border rounded"
          rows="5"
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={newPost.tags}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="file"
          name="media"
          accept="image/*,video/*"
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
        {newPost.media && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">Selected file: {newPost.media.name}</p>
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create Post
        </button>
      </form>

      <h2 className="text-2xl mb-2">All Posts</h2>
      
      {loading ? (
        <div className="text-center py-4">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-4">No posts found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostPage;
