import React, { useEffect, useState } from 'react';
import { apiConnector } from '../api/apiConnector';
import FollowRequestCard from '../components/FollowRequestCard';
import { toast } from 'react-toastify';

const FollowRequestsPage = () => {
  const [followRequests, setFollowRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowRequests = async () => {
      try {
        const response = await apiConnector('GET', '/follow/requests');
        setFollowRequests(response.data);
      } catch (error) {
        toast.error('Failed to fetch follow requests!');
      } finally {
        setLoading(false);
      }
    };

    fetchFollowRequests();
  }, []);

  const handleAcceptRequest = async (requestId) => {
    try {
      await apiConnector('POST', `/follow/accept/${requestId}`);
      setFollowRequests(followRequests.filter(request => request._id !== requestId));
      toast.success('Follow request accepted!');
    } catch (error) {
      toast.error('Failed to accept follow request!');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await apiConnector('POST', `/follow/reject/${requestId}`);
      setFollowRequests(followRequests.filter(request => request._id !== requestId));
      toast.success('Follow request rejected!');
    } catch (error) {
      toast.error('Failed to reject follow request!');
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading follow requests...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Follow Requests</h1>
      {followRequests.length === 0 ? (
        <p className="text-gray-500">No follow requests available.</p>
      ) : (
        followRequests.map((request) => (
          <FollowRequestCard
            key={request._id}
            request={request}
            onAccept={() => handleAcceptRequest(request._id)}
            onReject={() => handleRejectRequest(request._id)}
          />
        ))
      )}
    </div>
  );
};

export default FollowRequestsPage;
