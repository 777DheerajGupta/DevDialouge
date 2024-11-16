import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  getQuestionById, 
  deleteQuestion,
  updateQuestion,
  submitSolution ,
  getAnswersForQuestion,
  updateAnswer,
  deleteAnswer
} from '../services/questionService';

// Add a new Answer component
const Answer = ({ answer, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(answer.content);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!editedContent.trim()) {
      toast.error('Answer cannot be empty');
      return;
    }
    
    try {
      setLoading(true);
      await onUpdate(answer._id, editedContent);
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this answer?')) return;
    
    try {
      setLoading(true);
      await onDelete(answer._id);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b pb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <img
            src={answer.solver?.profilePicture || '/defaultProfilePic.jpg'}
            alt={answer.solver?.name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <div className="font-medium">{answer.solver?.name}</div>
            <div className="text-sm text-gray-500">
              {new Date(answer.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Answer Actions */}
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
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="4"
            disabled={loading}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedContent(answer.content);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="prose max-w-none">
          {answer.content}
        </div>
      )}
    </div>
  );
};

const QuestionDetail = () => {
  const { id, questionId } = useParams();
   const questionIdentifier = id || questionId;
  //  console.log("questionIdentifier", questionIdentifier);
  const navigate = useNavigate();
  
  // States
  const [question, setQuestion] = useState(null);
  const [newSolution, setNewSolution] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [solution, setSolutions] = useState([]);
  const [selectedTags , setSelectedTags] = useState({})
  // Add new state for media handling while keeping existing states
  const [newMedia, setNewMedia] = useState(null);

  // Add this state at the top with other states
  const [newQuestion, setNewQuestion] = useState({
    media: null
  });

  // Add editedTitle state
  const [editedTitle, setEditedTitle] = useState('');

  // Fetch question
  useEffect(() => {

    const fetchSolutions = async () => {
      try {
        const solutionsData = await getAnswersForQuestion(questionIdentifier);
        //  console.log("solutionsData", solutionsData);
        setSolutions(Array.isArray(solutionsData.data) ? solutionsData.data : []);
      } catch (error) {
        console.error('Error fetching solutions:', error);
        toast.error(error.message || 'Failed to fetch solutions');
      }
    };
    if (questionIdentifier) {
      fetchSolutions();
    }

    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const response = await getQuestionById(questionIdentifier);
        // console.log('question response by id' , response)
        if (response.success && response.data) {
          setQuestion(response.data);
          setEditedTitle(response.data.title); // Set initial title
          setEditedContent(response.data.content);
          setSelectedTags(new Set(response.data.tags.map(tag => tag.name)));
        }
      } catch (error) {
        console.error('Error fetching question:', error);
        toast.error(error.message || 'Failed to load question');
      } finally {
        setLoading(false);
      }
    };

    if (questionIdentifier) {
      fetchQuestion();
    }
  }, [questionIdentifier]);

  // Handle submitting a new solution
  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    if (!newSolution.trim()) {
      toast.error('Solution cannot be empty');
      return;
    }

    try {
      const response = await submitSolution(questionIdentifier, { content: newSolution });
      console.log('solution response is ', response)
      if (response.success) {
        setSolutions(prevSolutions => [...prevSolutions, response.data]);
        // setQuestion(prev => ({
        //   ...prev,
        //   solutions: [...(prev.solutions || []), response.data]
        // }));
        setNewSolution('');
        toast.success('Solution submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      toast.error(error.message || 'Failed to submit solution');
    }
  };

  // Handle question deletion
  const handleDeleteQuestion = async () => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      setLoading(true);
      console.log('Attempting to delete question:', questionIdentifier);

      const result = await deleteQuestion(questionIdentifier);
      
      if (result && result.success) {
        toast.success('Question deleted successfully');
        navigate('/ask-question');
        return;
      }
      
      toast.error('Failed to delete question');
    } catch (error) {
      console.error('Delete error in component:', error);
      if (error.response && (error.response.status === 200 || error.response.status === 204)) {
        toast.success('Question deleted successfully');
        navigate('/questions');
        return;
      }
      toast.error('Failed to delete question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle question update
  const handleUpdateQuestion = async () => {
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
      if (newQuestion?.media) {
        formData.append('media', newQuestion.media);
      }

      console.log('Updating question with data:', {
        id: questionIdentifier,
        title: editedTitle,
        content: editedContent,
        tags: Array.from(selectedTags),
        hasMedia: !!newQuestion?.media
      });

      const response = await updateQuestion(questionIdentifier, formData);
      console.log('question response', response)
      
      if (response.success) {
        setQuestion(response.data);
        setIsEditing(false);
        toast.success('Question updated successfully');
        // Instead of reloading, update the state
        setNewQuestion({ media: null });
      } else {
        throw new Error(response.message || 'Failed to update question');
      }
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(error.message || 'Failed to update question');
    } finally {
      setLoading(false);
    }
  };

  // Add these new functions
  const handleAnswerUpdate = async (answerId, content) => {
    try {
      const updatedAnswer = await updateAnswer(answerId, content);
      setSolutions(prevSolutions =>
        prevSolutions.map(solution =>
          solution._id === answerId ? { ...solution, content } : solution
        )
      );
      toast.success('Answer updated successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAnswerDelete = async (answerId) => {
    try {
      await deleteAnswer(answerId);
      setSolutions(prevSolutions =>
        prevSolutions.filter(solution => solution._id !== answerId)
      );
      toast.success('Answer deleted successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Add media change handler
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
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
  };

  // Update the cancel button click handler
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(question.title);
    setEditedContent(question.content);
    setNewQuestion({ media: null });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Question not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Question Header */}
        <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
        
        {/* Question Metadata */}
        <div className="flex items-center mb-6">
          <img 
            src={question.asker?.profilePicture || '/defaultProfilePic.jpg'}
            alt={question.asker?.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <div className="font-medium">{question.asker?.name}</div>
            <div className="text-sm text-gray-500">
              Asked on {new Date(question.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex gap-2 mb-4">
            {question.tags.map(tag => (
              <span 
                key={tag._id}
                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Question Content */}
        {isEditing ? (
          <div className="mb-4">
            {/* Title Input */}
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full text-3xl font-bold mb-4 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Question Title"
            />

            {/* Current Media Display */}
            {question.mediaUrls && question.mediaUrls.length > 0 && !newMedia && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current Media: </p>
                {question.mediaUrls[0].type === 'video' ? (
                  <video 
                    className="w-full max-h-[300px] object-contain rounded-lg"
                    controls
                  >
                    <source src={question.mediaUrls[0].url} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={question.mediaUrls[0].url}
                    alt="Current media"
                    className="max-h-[300px] object-contain rounded-lg"
                  />
                )}
              </div>
            )}

            {/* New Media Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {question.mediaUrls?.length > 0 ? 'Change Media' : 'Add Media'}
              </label>
              <input
                type="file"
                name="media"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="w-full p-2 border rounded-lg"
              />
              {newQuestion.media && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">New file selected: {newQuestion.media.name}</p>
                  {newQuestion.media.type.startsWith('image/') && (
                    <img
                      src={URL.createObjectURL(newQuestion.media)}
                      alt="Preview"
                      className="mt-2 max-h-[300px] object-contain rounded-lg"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Existing textarea and buttons */}
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleUpdateQuestion}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedTitle(question.title);
                  setEditedContent(question.content);
                  setNewQuestion({ media: null });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="prose max-w-none mb-6">
            {question.content}
          </div>
        )}

        {/* Question Actions */}
        <div className="flex gap-4 mb-8 text-sm">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 hover:underline"
          >
            Edit Question
          </button>
          <button
            onClick={handleDeleteQuestion}
            className="text-red-500 hover:underline"
          >
            Delete Question
          </button>
        </div>

        {/* Solutions Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Solutions ({solution.length})
          </h2>
          
          {/* Solutions List */}
          <div className="space-y-6">
            {solution.length > 0 ? (
              solution.map((answer) => (
                <Answer
                  key={answer._id}
                  answer={answer}
                  onUpdate={handleAnswerUpdate}
                  onDelete={handleAnswerDelete}
                />
              ))
            ) : (
              <p className="text-gray-500">No solutions yet. Be the first to provide a solution!</p>
            )}
          </div>

          {/* New Solution Form */}
          <form onSubmit={handleSubmitSolution} className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Your Solution</h3>
            <textarea
              value={newSolution}
              onChange={(e) => setNewSolution(e.target.value)}
              placeholder="Write your solution here..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="6"
              required
            />
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Post Your Solution
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail; 