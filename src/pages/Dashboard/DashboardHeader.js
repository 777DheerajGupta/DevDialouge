import React from 'react';

const DashboardHeader = ({ userData }) => {

  // console.log('userdata', userData);
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 rounded-full bg-gray-200">
          {userData?.profilePicture ? (
            <img 
              src={userData.profilePicture} 
              alt="Profile" 
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="h-full w-full rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {userData ? userData.name : 'User'}!
          </h1>
          <p className="text-gray-600">{userData?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader; 