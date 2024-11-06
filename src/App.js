// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Layout Components
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Page Components
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PostPage from './pages/PostPage';
import QuestionPage from './pages/QuestionPage';
import TopicsPage from './components/TrendingTopics';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ChatPage from './pages/ChatPage';
import NotificationPage from './pages/NotificationPage';
import FollowRequestPage from './pages/FollowRequestPage';
import TagPage from './pages/TagPage';
import GroupsList from './components/Groups/GroupsList';
import CreateGroup from './components/Groups/CreateGroup';
import GroupChat from './components/Groups/GroupChat';
import AskGeminiPage from './pages/AskGeminiPage';
import TrendingTopicsPage from './pages/TrendingTopicsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Component imports
import PostDetail from './components/PostDetail';
import QuestionDetail from './components/QuestionDetail';

// Auth Guard Component
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          {/* Dashboard */}
          <Route path="/" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />
           <Route path="/trending" element={<TrendingTopicsPage />} />
          {/* Posts */}
          <Route path="/create-post" element={
            <PrivateRoute>
              <PostPage />
            </PrivateRoute>
          } />
          <Route path="/posts/:id" element={
            <PrivateRoute>
              <PostDetail />
            </PrivateRoute>
          } />
          
          {/* Questions */}
          <Route path="/ask-question" element={
            <PrivateRoute>
              <QuestionPage />
            </PrivateRoute>
          } />
          <Route path="/questions/:id/*" element={
            <PrivateRoute>
              <QuestionDetail />
            </PrivateRoute>
          } />
          
          {/* Social Features */}
          {/* <Route path="/chat" element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          } /> */}
          <Route path="/notifications" element={
            <PrivateRoute>
              <NotificationPage />
            </PrivateRoute>
          } />
          <Route path="/follow-requests" element={
            <PrivateRoute>
              <FollowRequestPage />
            </PrivateRoute>
          } />
          
          {/* User & Topics */}
          <Route path="/topics" element={
            <PrivateRoute>
              <TopicsPage />
            </PrivateRoute>
          } />
          <Route path="/profile/:userId?" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />
          
          {/* Add this new route */}
          <Route path="/tags/:tagName" element={
            <PrivateRoute>
              <TagPage />
            </PrivateRoute>
          } />

          {/* Chat Routes */}
          <Route path="/chat" element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          } />

          {/* Group Routes */}
          <Route path="/groups" element={
            <PrivateRoute>
              <GroupsList />
            </PrivateRoute>
          } />

          <Route path="/groups/create" element={
            <PrivateRoute>
              <CreateGroup />
            </PrivateRoute>
          } />

          <Route path="/groups/:groupId" element={
            <PrivateRoute>
              <GroupChat />
            </PrivateRoute>
          } />
        </Route>

        <Route path='/ask-gemini' element={
          <PrivateRoute>
            <AskGeminiPage />
          </PrivateRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
