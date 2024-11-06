const jwt = require('jsonwebtoken');

const initializeChatSocket = (io) => {
    // Chat namespace
    const chatIO = io.of('/chat');

    // Authentication middleware for chat
    chatIO.use((socket, next) => {
        if (socket.handshake.auth && socket.handshake.auth.token) {
            jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) return next(new Error('Authentication error'));
                socket.user = decoded;
                next();
            });
        } else {
            next(new Error('Authentication error'));
        }
    });

    // Handle chat connections
    chatIO.on('connection', (socket) => {
        console.log('User connected to chat:', socket.user.id);

        // Join private chat room
        socket.on('join-chat', (data) => {
            const { userId, recipientId } = data;
            const room = [userId, recipientId].sort().join('-');
            socket.join(room);
            console.log(`User joined chat room: ${room}`);
        });

        // Handle private messages
        socket.on('private-message', (message) => {
            const room = [message.sender, message.recipient].sort().join('-');
            chatIO.to(room).emit('new-message', {
                ...message,
                sender: {
                    _id: socket.user.id,
                    name: socket.user.name,
                    profilePicture: socket.user.profilePicture
                }
            });
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

        socket.on('disconnect', () => {
            console.log('User disconnected from chat:', socket.user.id);
        });
    });

    return chatIO;
};

module.exports = initializeChatSocket; 