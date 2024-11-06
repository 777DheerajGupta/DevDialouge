const jwt = require('jsonwebtoken');
const User = require("../models/User");

// Middleware for JWT-based authentication
const authMiddleware = async (req, res, next) => {
    // Get token from headers
    const token = req.headers['authorization']?.split(' ')[1];
    // console.log("token is:", token);

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token is not valid' });
        }

        // Attach user to request object
        const user = await User.findById(decoded.id); // Ensure to access decoded.id here
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user; // Attach the user instance to the request object.
        req.User = decoded; // This can be kept if you still need the decoded token.

        // console.log("Authenticated user:", user);
        next();
    });
};

module.exports = authMiddleware;
