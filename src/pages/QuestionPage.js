import React, { useEffect, useState } from 'react';
import { apiConnector } from '../api/apiConnector';
import { toast } from 'react-toastify';
import QuestionCard from '../components/QuestionCard';

const QuestionPage = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    tags: '',
    media: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await apiConnector('GET', '/questions/');
        console.log(' get question API Response:', response.data.data);
        
        // const questionsData = Array.isArray(response.data.success) ? response.data : response.data.data;
        // console.log('questiondata' , questionsData)
        setQuestions(response.data.data || []);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast.error('Failed to fetch questions!');
        setQuestions([]);
      }
    };

    fetchQuestions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'media') {
      // Validate file type and size
      const file = files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast.error('File size should be less than 5MB');
          return;
        }
        setNewQuestion(prev => ({
          ...prev,
          media: file
        }));
      }
    } else {
      setNewQuestion(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', newQuestion.title);
      formData.append('content', newQuestion.content);
      
      // Handle tags
      const tagsArray = newQuestion.tags
        ? newQuestion.tags.split(',').map(tag => tag.trim())
        : [];
      formData.append('tags', JSON.stringify(tagsArray));
      
      // Add media if exists
      if (newQuestion.media) {
        formData.append('media', newQuestion.media);
      }

      const response = await apiConnector('POST', '/questions', formData, true);
      console.log('question response', response)

      if (response.data.success) {
        setQuestions(prev => [response.data.data, ...prev]);
        setNewQuestion({ title: '', content: '', tags: '', media: null });
        toast.success('Question posted successfully!');
      }
    } catch (error) {
      console.error('Error posting question:', error);
      toast.error(error.message || 'Failed to post question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Questions</h1>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow-md">
        <h2 className="text-2xl mb-2">Ask a New Question</h2>
        <input
          type="text"
          name="title"
          placeholder="Question Title"
          value={newQuestion.title}
          onChange={handleInputChange}
          required
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          name="content"
          placeholder="Details about your question"
          value={newQuestion.content}
          onChange={handleInputChange}
          required
          className="w-full p-2 mb-2 border rounded"
          rows="5"
        />
        <div className="mb-2">
          <input
            type="file"
            name="media"
            accept="image/*"
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          {newQuestion.media && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Selected: {newQuestion.media.name}</p>
              <img 
                src={URL.createObjectURL(newQuestion.media)} 
                alt="Preview" 
                className="mt-2 max-h-40 rounded"
              />
            </div>
          )}
        </div>
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={newQuestion.tags}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white
            ${loading 
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {loading ? 'Posting...' : 'Ask Question'}
        </button>
      </form>

      <h2 className="text-2xl mb-2">All Questions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(questions) && questions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
        {(!questions || questions.length === 0) && (
          <p className="text-gray-500">No questions found.</p>
        )}
      </div>
    </div>
  );
};

export default QuestionPage;
