import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiConnector } from '../api/apiConnector';
import { toast } from 'react-toastify';
import DashboardHeader from './Dashboard/DashboardHeader';
import ActivityFeed from './Dashboard/ActivityFeed';
import UserStats from './Dashboard/UserStats';
import QuickActions from './Dashboard/QuickActions';
import NotificationPanel from './Dashboard/NotificationPanel';
import AdditionalSections from './Dashboard/AdditionalSections';

const DashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.log('No userId found in localStorage');
          navigate('/login');
          return;
        }
        
       // console.log('Calling API endpoint:', `/users/${userId}`);
        
        const response = await apiConnector('GET', `/users/${userId}`);
         console.log('user response', response.data);
        
        if (response.data.data) {
          setUserData(response.data.data);
        } else {
          throw new Error('No user data received');
        }
      } catch (error) {
        console.error('Error details:', error);
        toast.error('Failed to fetch user data!');
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await apiConnector('GET', '/posts/');
        // console.log(' post response', response.data.data);
        setPosts(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch posts!');
      }
    };

    const fetchQuestions = async () => {
      try {
        const response = await apiConnector('GET', '/questions/');
        console.log(' question response', response.data.data);
        setQuestions(response.data.data || []);
      } catch (error) {
        toast.error('Failed to fetch questions!');
        setQuestions([]);
      }
    };

    fetchUserData();
    fetchPosts();
    fetchQuestions();
  }, [navigate]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader userData={userData} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />
            
            <ActivityFeed posts={posts} questions={questions} />
          </div>
          
          <div className="space-y-6">
            <UserStats userData={userData} />
            <NotificationPanel />
            <AdditionalSections />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
