import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiConnector } from '../api/apiConnector';
import PostCard from '../components/PostCard';
import { toast } from 'react-toastify';
import QuestionCard from '../components/QuestionCard';

const TagPage = () => {
  const { tagName } = useParams();
  const [posts, setPosts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(true);

  useEffect(() => {
    const fetchTagPosts = async () => {
      try {
        setPostsLoading(true);
        const response = await apiConnector('GET', `/posts/tag/${tagName}`);
        setPosts(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        toast.error('Failed to fetch posts for this tag');
        setPosts([]);
      } finally {
        setPostsLoading(false);
      }
    };

    const fetchTagQuestions = async () => {
      try {
        setQuestionsLoading(true);
        const response = await apiConnector('GET', `/questions/tag/${tagName}`);
        setQuestions(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
        toast.error('Failed to fetch questions for this tag');
        setQuestions([]);
      } finally {
        setQuestionsLoading(false);
      }
    };

    fetchTagPosts();
    fetchTagQuestions();
  }, [tagName]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Content tagged with #{tagName}</h1>
      
      {/* Posts Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        {postsLoading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <p className="text-gray-600">No posts found with this tag.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
      
      {/* Questions Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Questions</h2>
        {questionsLoading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <p className="text-gray-600">No questions found with this tag.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagPage; 