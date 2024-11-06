import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiConnector } from '../../api/apiConnector';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

const CreateGroup = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    avatar: ''
  });

  // Search users when searchTerm changes
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await apiConnector('GET', `/users/all`);
        console.log('users', response);
        // Filter out already selected members and current user
        const filteredUsers = response.data.data.filter(
          searchUser => 
            !selectedMembers.some(member => member._id === searchUser.id) &&
            searchUser._id !== user.id
        );
        setSearchResults(filteredUsers);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    };

    const timeoutId = setTimeout(searchUsers, 500); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedMembers, user._id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddMember = (member) => {
    setSelectedMembers([...selectedMembers, member]);
    setSearchResults(searchResults.filter(user => user.id !== member._id));
    setSearchTerm('');
  };

  const handleRemoveMember = (memberId) => {
    setSelectedMembers(selectedMembers.filter(member => member._id !== memberId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
        toast.error('Group name is required');
        return;
    }

    try {
        setLoading(true);
        const memberIds = selectedMembers.map(member => member._id);

        const response = await apiConnector('POST', '/groups/', {
            name: formData.name,
            description: formData.description,
            // image: formData.avatar,
            members: memberIds // Backend will automatically add creator
        });

        if (response.data.success) {
            toast.success('Group created successfully!');
            navigate(`/groups/${response.data._id}`);
        } else {
            throw new Error(response.message || 'Failed to create group');
        }
    } catch (error) {
        console.error('Error creating group:', error);
        toast.error(error.message || 'Failed to create group');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Create New Group</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter group name"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter group description"
            rows="3"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Avatar URL
          </label>
          <input
            type="url"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter avatar URL (optional)"
            disabled={loading}
          />
        </div>

        {/* Add Members Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add Members
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Search users by name or email"
              disabled={loading}
            />
            
            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((searchUser) => (
                  <div
                    key={searchUser._id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAddMember(searchUser)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={searchUser.profilePicture || '/default-avatar.png'}
                        alt={searchUser.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{searchUser.name}</p>
                        <p className="text-sm text-gray-500">{searchUser.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Members List */}
          {selectedMembers.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Members:</h4>
              <div className="space-y-2">
                {selectedMembers.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={member.profilePicture || '/default-avatar.png'}
                        alt={member.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{member.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Group'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/groups')}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup;