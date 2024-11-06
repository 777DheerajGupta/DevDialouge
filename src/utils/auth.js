// auth.js

// Function to get the token from localStorage
export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Function to set the token in localStorage
  export const setToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  // Function to remove the token from localStorage (logout)
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  
  // Function to check if the user is authenticated
  export const isAuthenticated = () => {
    const token = getToken();
    // You can add further validation for the token if needed
    return !!token; // Returns true if the token exists
  };
  
  // Function to decode the token (if it's a JWT)
  export const decodeToken = (token) => {
    if (!token) return null;
    try {
      const payload = token.split('.')[1]; // Get the payload part of the JWT
      return JSON.parse(atob(payload)); // Decode the base64 payload
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };
  
  // Function to get user data from the token
  export const getUserData = () => {
    const token = getToken();
    return decodeToken(token);
  };
  