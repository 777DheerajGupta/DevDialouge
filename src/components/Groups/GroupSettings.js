import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiConnector } from '../../api/apiConnector';
import { useSelector } from 'react-redux';  
import { socketService } from '../../services/socketService';
import  {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GroupSettings = ({ group, onClose, onUpdate }) => {
  const memberActionsRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('participants');
  const isAdmin = group.admin.some(admin => admin._id === user.id);

  const [formData, setFormData] = useState({
    name: group?.name || '',
    description: group?.description || '',
    image: group?.image || ''
  });

  const [memberActionsMap, setMemberActionsMap] = useState({});

  useEffect(() => {
    function handleClickOutside(event) {
        if (memberActionsRef.current && !memberActionsRef.current.contains(event.target)) {
            setMemberActionsMap({}); // Clear all dropdowns
        }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Group name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await apiConnector('PUT', `/groups/${group._id}`, formData);
      
      if (response.data.success) {
        onUpdate(response.data.data);
        setEditMode(false);
        toast.success('Group updated successfully');
      }
    } catch (error) {
      console.error('Error updating group:', error);
      toast.error(error.response?.data?.message || 'Failed to update group');
    } finally {
      setLoading(false);
    }
  };

  // Search users
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      const response = await apiConnector('GET', `/users/all`);
      // Filter out users who are already members
      const filteredUsers = response.data.data.filter(
        searchUser => !group.members.some(member => member.user._id === searchUser._id)
      );
      setSearchResults(filteredUsers);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    }
  };

  // Debounce search
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        searchUsers(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleAddMember = async (userId) => {
    try {
      setLoading(true);
      const response = await apiConnector('POST', `/groups/${group._id}/members`, {
        userId: userId
      });

      if (response.data.success) {
        // Update the group state with new member
        onUpdate(response.data.data);
        setSearchTerm('');
        setSearchResults([]);
        toast.success('Member added successfully');
        
        // Emit socket event for real-time update
        socketService.emitGroupUpdate(group._id, 'MEMBER_ADDED', {
          groupId: group._id,
          userId: userId
        });
      }
    } catch (error) {
      console.error('Error adding member:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add member';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    console.log("Remove member called with ID:", memberId);
    try {
        if (!window.confirm('Are you sure you want to remove this member?')) {
            return;
        }

        const response = await apiConnector(
            'DELETE', 
            `/groups/${group._id}/members/${memberId}`
        );
        // console.log("Remove response:", response.data.success);

        if (response.data.success) {
            // Update local state
            const updatedMembers = group.members.filter(
                member => member.user._id !== memberId
            );
            onUpdate({ ...group, members: updatedMembers });
            
            toast.success('Member removed successfully');
            setMemberActionsMap({});
        }
    } catch (error) {
        console.error('Error removing member:', error);
        toast.error(error.response?.data?.message || 'Failed to remove member');
    }
  };

  // Update the button to be more responsive
  const RemoveButton = ({ member, isLoading, onRemove }) => {
    const [localLoading, setLocalLoading] = useState(false);

    const handleClick = async () => {
        setLocalLoading(true);
        await onRemove(member.user);
        setLocalLoading(false);
    };

    return (
        <button
            onClick={handleClick}
            className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                localLoading || isLoading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            disabled={localLoading || isLoading}
        >
            {localLoading ? (
                <span className="flex items-center space-x-1">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            fill="none" 
                        />
                        <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                        />
                    </svg>
                    <span>Removing...</span>
                </span>
            ) : (
                'Remove'
            )}
        </button>
    );
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await apiConnector('DELETE', `/groups/${group._id}`);

      console.log(" delete response", response);

      if (response.data.success) {
        toast.success('Group deleted successfully');
        navigate('/groups');
        
        // Emit socket event for real-time update
        socketService.socket?.emit('group-deleted', {
          groupId: group._id
        });
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error(error.response?.data?.message || 'Failed to delete group');
    } finally {
      setLoading(false);
    }
  };

  // Update the click handler
  const toggleMemberActions = (memberId) => {
    // console.log("Toggle member actions for ID:", memberId);
    setMemberActionsMap(prev => {
        const newMap = {};
        newMap[memberId] = !prev[memberId];
        return newMap;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="w-[400px] bg-white h-full animate-slide-in">
        {/* Header */}
        <div className="p-4 bg-[#008069] text-white">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="hover:bg-white/10 p-2 rounded-full"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <h2 className="text-xl font-medium">
              {editMode ? 'Edit Group' : 'Group Info'}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-64px)]">
          {editMode ? (
            // Edit Group Form
            <div className="p-4">
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Group Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#00a884] text-white rounded-lg hover:bg-[#008069]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Group Image and Name */}
              <div className="p-4 space-y-4">
                <div className="flex justify-center">
                  <img
                    src={group.image || '/default-group.png'}
                    alt={group.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-medium text-[#111b21]">
                    {group.name}
                  </h3>
                  <p className="text-[#667781]">
                    Group · {group.members?.length || 0} participants
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-t border-gray-200">
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('participants')}
                    className={`flex-1 py-3 text-center ${
                      activeTab === 'participants'
                        ? 'text-[#00a884] border-b-2 border-[#00a884]'
                        : 'text-[#667781]'
                    }`}
                  >
                    Participants
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`flex-1 py-3 text-center ${
                        activeTab === 'settings'
                          ? 'text-[#00a884] border-b-2 border-[#00a884]'
                          : 'text-[#667781]'
                      }`}
                    >
                      Settings
                    </button>
                  )}
                </div>

                {/* Participants List */}
                {activeTab === 'participants' && (
                  <div className="p-4">
                    {/* Add Participants Section */}
                    {isAdmin && (
                      <div className="mb-4">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search users to add..."
                          className="w-full p-3 border rounded-lg"
                        />
                        {searchResults.length > 0 && (
                          <div className="mt-2 border rounded-lg">
                            {searchResults.map(user => (
                              <div
                                key={user._id}
                                className="flex items-center justify-between p-3 hover:bg-gray-50"
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={user.profilePicture || '/default-avatar.png'}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full"
                                  />
                                  <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleAddMember(user._id)}
                                  className="px-3 py-1 bg-[#00a884] text-white rounded-lg hover:bg-[#008069]"
                                >
                                  Add
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Members List */} 
                    
                    <div className="space-y-1">
                      {group.members?.map((member) => {
                        const isAdmin = group.admin.some(admin => admin._id === member.user._id);
                        const isCurrentUser = member.user._id === user.id;
                        const currentUserIsAdmin = group.admin.some(admin => admin._id === user.id);
                        
                        return (
                          <div
                            key={member._id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={member.user.profilePicture || '/default-avatar.png'}
                                alt={member.user.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-[#111b21]">
                                    {member.user.name}
                                    {isCurrentUser && " (You)"}
                                  </p>
                                  {isAdmin && (
                                    <span className="text-xs text-[#00a884] bg-[#e8f8f5] px-2 py-0.5 rounded-full">
                                      Admin
                                    </span>
                                  )}
                                </div>
                               
                              </div>
                            </div>

                            {/* Member Actions */}
                            {currentUserIsAdmin && !isCurrentUser && (
                                <div 
                                    className="relative" 
                                    ref={memberActionsRef}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // console.log("Clicked member ID:", member.user._id);
                                            toggleMemberActions(member.user._id);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-full text-[#54656f]"
                                    >
                                        <i className="fas fa-ellipsis-vertical"></i>
                                    </button>

                                    {/* Member Actions Dropdown */}
                                    {memberActionsMap[member.user._id] && (
                                        <div 
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-1"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {!isAdmin && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Make admin functionality
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-[#111b21] hover:bg-[#f0f2f5] flex items-center gap-3"
                                                >
                                                    <i className="fas fa-user-shield text-[#54656f]"></i>
                                                    Make Admin
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log("Remove clicked for:", member.user._id);
                                                    handleRemoveMember(member.user._id);
                                                }}
                                                className="w-full px-4 py-2 text-left text-red-500 hover:bg-[#f0f2f5] flex items-center gap-3"
                                            >
                                                <i className="fas fa-user-minus"></i>
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && isAdmin && (
                  <div className="p-4 space-y-4">
                    <button
                      onClick={() => setEditMode(true)}
                      className="w-full p-3 flex items-center justify-between text-[#111b21] hover:bg-[#f0f2f5] rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <i className="fas fa-pen text-[#54656f]"></i>
                        <span>Edit Group Info</span>
                      </div>
                      <i className="fas fa-chevron-right text-[#54656f]"></i>
                    </button>

                    <button
                      onClick={handleDeleteGroup}  // Add onClick handler
                      className="w-full p-3 flex items-center justify-between text-red-500 hover:bg-[#f0f2f5] rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <i className="fas fa-trash"></i>
                        <span>Delete Group</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupSettings;