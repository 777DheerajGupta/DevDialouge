// src/pages/ResetPasswordPage.js
import React, { useState, useEffect } from 'react';
import { apiConnector } from '../api/apiConnector';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Get email from localStorage that was set in ForgotPasswordPage
        const email = localStorage.getItem('resetEmail');
        if (email) {
            setFormData(prev => ({ ...prev, email }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate passwords match
        // if (formData.newPassword !== formData.confirmPassword) {
        //     toast.error('Passwords do not match');
        //     return;
        // }

        // Validate password strength
        if (formData.newPassword.length < 4) {
            toast.error('Password must be at least 4 characters long');
            return;
        }

        setLoading(true);
        try {
            const response = await apiConnector('POST', '/auth/reset-password', {
                email: formData.email,
                otp: formData.otp,
                newPassword: formData.newPassword
            });
            console.log('Reset password response:', response);

            toast.success(response.data.message || 'Password reset successful');
            localStorage.removeItem('resetEmail'); // Clean up
            navigate('/login'); // Navigate to login page
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Back Button */}
                <div className="absolute top-4 left-4">
                    <button
                        onClick={() => navigate('/forgot-password')}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <svg 
                            className="w-5 h-5 mr-2" 
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
                </div>

                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Reset Password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter the OTP sent to your email and your new password
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                OTP
                            </label>
                            <input
                                type="text"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                                placeholder="Enter OTP"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                                placeholder="Enter new password"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                    loading 
                                        ? 'bg-blue-400 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                }`}
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <svg 
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 24 24"
                                        >
                                            <circle 
                                                className="opacity-25" 
                                                cx="12" 
                                                cy="12" 
                                                r="10" 
                                                stroke="currentColor" 
                                                strokeWidth="4"
                                            />
                                            <path 
                                                className="opacity-75" 
                                                fill="currentColor" 
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Resetting Password...
                                    </div>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
