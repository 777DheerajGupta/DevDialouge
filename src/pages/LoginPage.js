import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiConnector } from '../api/apiConnector';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setLoading } from '../redux/slices/chatSlice';
import { loginFailure , loginSuccess} from '../redux/slices/authSlice';
import { isAuthenticated } from '../utils/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      
      //console.log('Attempting login with:', { email });
      
      const response = await apiConnector('POST', '/auth/login', { email, password });



      //  console.log('Login response:', response);

      // Check if the response has the expected data
      // console.log('Full response:', response);
       console.log('Response data:', response.data);
      // console.log('User object:', response.data?.user);
      // console.log('User ID:', response.data?.user?.id);

      if (!response?.data?.token || !response?.data?.user || !response?.data?.user?.id) {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response from server - missing token, user, or user ID');
      }

      // If login is successful
      const userId = response?.data?.user?.id;
      // console.log('About to set userId in localStorage:', userId);
      localStorage.setItem('userId', userId);
      
      // Verify it was set
      const storedId = localStorage.getItem('userId');
      // console.log('Verified userId in localStorage:', storedId);

      dispatch(loginSuccess({ 
        token: response?.data?.token,
        user: response?.data?.user,
        isAuthenticated
      }));
      
      toast.success('Login successful!');
      navigate('/');

    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      dispatch(loginFailure(error.response?.data?.message || 'Invalid credentials'));
      toast.error(error.response?.data?.message || 'Login failed!');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white w-full py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</a>
        </div>
        <div className="mt-2 text-center">
          <span>Don't have an account? </span>
          <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
