import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserPosts } from '../services/postService';
import { toast } from 'react-toastify';

const UserPosts = () => {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const data = await getUserPosts(userId);
        setPosts(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserPosts();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">User Posts</h1>
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post._id} className="bg-white rounded-lg shadow-md p-6">
              <Link to={`/posts/${post._id}`}>
                <h2 className="text-xl font-bold mb-2 hover:text-blue-500">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-600 mb-4">{post.content}</p>
              <div className="text-sm text-gray-500">
                Posted on {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No posts found for this user.</p>
      )}
    </div>
  );
};

export default UserPosts; 