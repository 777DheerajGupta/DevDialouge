import React, { useEffect, useState } from 'react';
import { apiConnector } from '../api/apiConnector';
import NotificationCard from '../components/NotificationCard';
import { toast } from 'react-toastify';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiConnector('GET', '/notifications');
        setNotifications(response.data);
      } catch (error) {
        toast.error('Failed to fetch notifications!');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading notifications...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications available.</p>
      ) : (
        notifications.map((notification) => (
          <NotificationCard key={notification._id} notification={notification} />
        ))
      )}
    </div>
  );
};

export default NotificationPage;
