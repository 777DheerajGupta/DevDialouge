const jwt = require('jsonwebtoken');

const initializeGroupSocket = (io) => {
    // Group namespace
    const groupIO = io.of('/groups');

    // Authentication middleware for groups
    groupIO.use((socket, next) => {
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

    // Handle group connections
    groupIO.on('connection', (socket) => {
        console.log('User connected to groups:', socket.user.id);

        // Join group rooms
        socket.on('join-groups', (groups) => {
            groups.forEach(groupId => {
                socket.join(`group-${groupId}`);
                console.log(`User joined group: ${groupId}`);
            });
        });

        // Handle group messages
        socket.on('group-message', (data) => {
            const { groupId, message } = data;
            groupIO.to(`group-${groupId}`).emit('new-group-message', {
                groupId,
                message: {
                    ...message,
                    sender: {
                        _id: socket.user.id,
                        name: socket.user.name,
                        profilePicture: socket.user.profilePicture
                    }
                }
            });
        });

        // Handle group typing status
        socket.on('group-typing', (data) => {
            const { groupId, isTyping } = data;
            socket.to(`group-${groupId}`).emit('user-typing', {
                groupId,
                userId: socket.user.id,
                userName: socket.user.name,
                isTyping
            });
        });

        // Handle group read receipts
        socket.on('group-message-read', (data) => {
            const { groupId, messageId } = data;
            groupIO.to(`group-${groupId}`).emit('group-read-receipt', {
                groupId,
                messageId,
                readBy: socket.user.id
            });
        });

        // Handle group updates
        socket.on('group-update', (data) => {
            const { groupId, updateType, payload } = data;
            groupIO.to(`group-${groupId}`).emit('group-updated', {
                groupId,
                updateType,
                payload,
                updatedBy: socket.user.id
            });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected from groups:', socket.user.id);
        });
    });

    return groupIO;
};

module.exports = initializeGroupSocket; 