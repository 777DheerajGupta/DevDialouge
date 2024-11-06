import React, { useState, useEffect } from 'react';
import { apiConnector } from '../../api/apiConnector';
import { toast } from 'react-hot-toast';

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await apiConnector('GET', '/notifications');
        
        // Check if response has the expected structure
        if (response?.data?.data) {
          setNotifications(response.data.data);
        } else {
          setNotifications([]); // Set empty array if no notifications
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setError(error.message || 'Failed to load notifications');
        toast.error('Failed to load notifications');
        setNotifications([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <div className="text-center py-4">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-blue-500 hover:text-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <div className="space-y-4">
        {Array.isArray(notifications) && notifications.length > 0 ? (
          notifications.map((notification) => (
            <div 
              key={notification._id} 
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <p className="text-sm">{notification.message}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {!notification.read && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    New
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel; 