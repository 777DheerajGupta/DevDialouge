import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiConnector } from '../../api/apiConnector';
import { toast } from 'react-hot-toast';

const GroupsList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await apiConnector('GET', '/groups/all');
        //  console.log('groups response', response.data.data);
        
        // Check if response and data exist
        if (response?.data?.data) {
          setGroups(response.data.data);
        } else {
          setGroups([]); // Set empty array if no data
          setError('No groups found');
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
        setError(error.message || 'Failed to fetch groups');
        toast.error('Failed to fetch groups');
        setGroups([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Groups</h1>
          <Link
            to="/groups/create"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Create New Group
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Groups</h1>
        <Link
          to="/groups/create"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Create New Group
        </Link>
      </div>

      {groups && groups.length > 0 ? (
        <div className="grid grid-rows-1 md:grid-rows-2 lg:grid-rows-3 gap-4">
          {groups.map((group) => (
            <Link
              key={group._id}
              to={`/groups/${group._id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                  {group.name?.charAt(0) || '?'}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{group.name}</h3>
                  <p className="text-gray-500">
                    {group.members?.length || 0} members
                  </p>
                  {group.description && (
                    <p className="text-gray-600 text-sm mt-1">
                      {group.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You haven't joined any groups yet.</p>
          <Link
            to="/groups/create"
            className="text-blue-500 hover:text-blue-600"
          >
            Create your first group
          </Link>
        </div>
      )}
    </div>
  );
};

export default GroupsList; 