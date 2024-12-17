const jwt = require('jsonwebtoken');

const initializeChatSocket = (io) => {
    // Chat namespace
 const chatIO = io.of('/chat');

    // Mapping of user IDs to socket IDs
    const userSocketMap = {}; // Example mapping

    // Authentication middleware for chat
    chatIO.use((socket, next) => {
        if (socket.handshake.auth && socket.handshake.auth.token) {
            jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) return next(new Error('Authentication error'));
                socket.user = decoded; // Attach user info to socket
                next();
            });
        } else {
            next(new Error('Authentication error'));
        }
    });

    // Handle chat connections
    chatIO.on('connection', (socket) => {
        console.log('User connected to chat:', socket.user.id);

        // Register user and store their socket ID
        socket.on('register-user', (userId) => {
            userSocketMap[userId] = socket.id;
            console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
        });

        // Join private chat room
        socket.on('join-chat', (data) => {
            const { userId, recipientId } = data;
            const room = [userId, recipientId].sort().join('-');
            socket.join(room);
            console.log(`User joined chat room: ${room}`);
        });

        // Handle private messages
        socket.on('private-message', (message) => {
            console.log('Private message received:', message);
            const recipientSocketId = userSocketMap[message.recipient._id]; // Get recipient's socket ID
            if (recipientSocketId) {
                chatIO.to(recipientSocketId).emit('private-message', message); // Emit message to recipient
                console.log('Message emitted to recipient:', message);
            } else {
                console.error('Recipient not connected:', message.recipient._id);
            }
        });

        // Handle typing status
        socket.on('typing', (data) => {
            const { recipientId, isTyping } = data;
            const room = [socket.user.id, recipientId].sort().join('-');
            socket.to(room).emit('user-typing', {
                userId: socket.user.id,
                isTyping
            });
        });

        // Handle read receipts
        socket.on('message-read', (data) => {
            const { senderId, messageId } = data;
            const room = [socket.user.id, senderId].sort().join('-');
            chatIO.to(room).emit('read-receipt', {
                messageId,
                readBy: socket.user.id
            });
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected from chat:', socket.user.id);
            // Remove user from the mapping
            for (const userId in userSocketMap) {
                if (userSocketMap[userId] === socket.id) {
                    delete userSocketMap[userId];
                    console.log(`User unregistered: ${userId}`);
                    break;
                }
            }
        });
    });

    return chatIO;
};

module.exports = initializeChatSocket;
