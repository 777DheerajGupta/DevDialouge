// Required Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {createServer} = require('node:http');
const socketIO = require('socket.io');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const initializeChatSocket = require('./config/chatSocket');
const initializeGroupSocket = require('./config/groupSocket');
const {cloudinaryConnect} = require('./config/cloudinary');
const path = require('path');
const fileUpload = require('express-fileupload');
const {Server} = require('socket.io')   



cloudinaryConnect();


dotenv.config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const questionRoutes = require('./routes/questionRoutes');
const solutionRoutes = require('./routes/solutionRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const followRoutes = require('./routes/followRoutes');
const groupRoutes = require('./routes/groupRoutes');
const tagRoutes = require('./routes/tagRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const geminiRoutes = require('./routes/geminiRoutes')
const trendingRoutes = require('./routes/trendingRoutes');

// Create Express App
const app = express();
const server = createServer(app);

 app.use(express.json());




// Configure CORS for Express
app.use(cors({
    origin: process.env.FRONTEND_URL || "https://dev-dialouge-frontend.vercel.app",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Configure Socket.IO with CORS and authentication
const io = socketIO(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "https://dev-dialouge-frontend.vercel.app",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const chatIO = initializeChatSocket(io);
 console.log('chat io', chatIO)
const groupIO = initializeGroupSocket(io);

// Make both socket instances available in routes
app.use((req, res, next) => {
    req.io = {
        chat: chatIO,
        groups: groupIO
    };
    next();
});

// Socket.IO middleware for authentication
// io.use((socket, next) => {
//     if (socket.handshake.auth && socket.handshake.auth.token) {
//         jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET, (err, decoded) => {
//             if (err) return next(new Error('Authentication error'));
//             socket.user = decoded;
//             next();
//         });
//     } else {
//         next(new Error('Authentication error'));
//     }
// });

// Middleware to handle null body
app.use((req, res, next) => {
    if (req.body === null) {
        req.body = {};
    }
    next();
});

app.use((req, res, next) => {
    if (req.method === 'DELETE') {
      next();  // Skip JSON parsing for DELETE requests
    } else {
      express.json()(req, res, next);
    }
  });
  


// Database Connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Socket.IO connection handling
// io.on('connection', (socket) => {
//     console.log('New client connected:', socket.user?.id);

//     // Join private chat room
//     socket.on('join-private', (data) => {
//         const { userId, recipientId } = data;
//         const room = [userId, recipientId].sort().join('-');
//         socket.join(room);
//         console.log(`User joined private room: ${room}`);
//     });

//     // Join group chat rooms
//     socket.on('join-groups', (groups) => {
//         groups.forEach(groupId => {
//             socket.join(`group-${groupId}`);
//             console.log(`User joined group: ${groupId}`);
//         });
//     });

//     // Handle private messages
//     socket.on('private-message', (message) => {
//         const room = [message.sender, message.recipient].sort().join('-');
//         io.to(room).emit('private-message', message);
//         console.log(`Private message sent in room: ${room}`);
//     });

//     // Handle group messages
//     socket.on('group-message', (data) => {
//         const { groupId, message } = data;
//         io.to(`group-${groupId}`).emit('new-group-message', {
//             groupId,
//             message: {
//                 ...message,
//                 sender: {
//                     _id: socket.user.id,
//                     name: socket.user.name,
//                     profilePicture: socket.user.profilePicture
//                 }
//             }
//         });
//         console.log(`Group message sent in group: ${groupId}`);
//     });

//     // Handle typing status
//     socket.on('typing', (data) => {
//         const { groupId, userName } = data;
//         socket.to(`group-${groupId}`).emit('user-typing', {
//             groupId,
//             userName
//         });
//     });

//     // Handle read receipts
//     socket.on('message-read', (data) => {
//         const { groupId, messageId } = data;
//         socket.to(`group-${groupId}`).emit('read-receipt', {
//             groupId,
//             messageId,
//             userId: socket.user.id
//         });
//     });

//     // Handle group updates
//     socket.on('group-update', (data) => {
//         const { groupId, updateType, payload } = data;
//         io.to(`group-${groupId}`).emit('group-updated', {
//             groupId,
//             updateType,
//             payload
//         });
//     });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         console.log('Client disconnected:', socket.user?.id);
//     });
// });

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/solutions', solutionRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/follow', followRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/tags', tagRoutes);
app.use('/api/v1/ratings', ratingRoutes);
app.use('/api/v1/gemini', geminiRoutes);
app.use('/api/v1/trending', trendingRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to DevDialouge Backend');
});

// Server Listening
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
