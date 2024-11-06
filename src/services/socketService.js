import io from 'socket.io-client';

class SocketService {
    constructor() {
        this.chatSocket = null;
        this.groupSocket = null;
    }

    connectChat() {
        if (this.chatSocket) return;

        const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000/api/v1';
        const token = localStorage.getItem('token');
        
        try {
            this.chatSocket = io(`${BASE_URL}/chat`, {
                auth: { token },
                withCredentials: true,
                transports: ['polling', 'websocket'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            this.chatSocket.on('connect', () => {
                console.log('Chat Socket Connected Successfully');
            });

            this.chatSocket.on('connect_error', (error) => {
                console.error('Chat Socket Connection Error:', error);
            });

            this.chatSocket.on('disconnect', () => {
                console.log('Chat Socket Disconnected');
            });

        } catch (error) {
            console.error('Chat Socket Initialization Error:', error);
        }
    }

    connectGroup() {
        if (this.groupSocket) return;

        const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000/api/v1';
        const token = localStorage.getItem('token');
        
        try {
            this.groupSocket = io(BASE_URL, {
                auth: { token },
                withCredentials: true,
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                path: '/socket.io'
            });

            this.groupSocket.on('connect', () => {
                console.log('Group Socket Connected Successfully');
            });

            this.groupSocket.on('connect_error', (error) => {
                console.error('Group Socket Connection Error:', error);
            });

            this.groupSocket.on('disconnect', () => {
                console.log('Group Socket Disconnected');
            });

        } catch (error) {
            console.error('Group Socket Initialization Error:', error);
            throw error;
        }
    }

    // Chat Methods
    joinChat(userId, recipientId) {
        if (this.chatSocket) {
            this.chatSocket.emit('join-chat', { userId, recipientId });
        }
    }

    sendPrivateMessage(message) {
        if (this.chatSocket) {
            this.chatSocket.emit('private-message', message);
        }
    }

    onNewMessage(callback) {
        if (this.chatSocket) {
            this.chatSocket.on('new-message', callback);
        }
    }

    sendTypingStatus(recipientId, isTyping) {
        if (this.chatSocket) {
            this.chatSocket.emit('typing', { recipientId, isTyping });
        }
    }

    onUserTyping(callback) {
        if (this.chatSocket) {
            this.chatSocket.on('user-typing', callback);
        }
    }

    sendMessageRead(senderId, messageId) {
        if (this.chatSocket) {
            this.chatSocket.emit('message-read', { senderId, messageId });
        }
    }

    onReadReceipt(callback) {
        if (this.chatSocket) {
            this.chatSocket.on('read-receipt', callback);
        }
    }

    // Group Methods
    joinGroups(groups) {
        if (this.groupSocket) {
            console.log('Joining groups:', groups);
            this.groupSocket.emit('join-groups', groups);
        }
    }

    sendGroupMessage(groupId, message) {
        if (this.groupSocket) {
            console.log('Sending group message:', { groupId, message });
            this.groupSocket.emit('group-message', { groupId, message });
        }
    }

    onNewGroupMessage(callback) {
        if (this.groupSocket) {
            this.groupSocket.on('new-group-message', callback);
        }
    }

    sendGroupTyping(groupId, isTyping) {
        if (this.groupSocket) {
            this.groupSocket.emit('group-typing', { groupId, isTyping });
        }
    }

    onGroupTyping(callback) {
        if (this.groupSocket) {
            this.groupSocket.on('user-typing', callback);
        }
    }

    sendGroupMessageRead(groupId, messageId) {
        if (this.groupSocket) {
            this.groupSocket.emit('group-message-read', { groupId, messageId });
        }
    }

    onGroupReadReceipt(callback) {
        if (this.groupSocket) {
            this.groupSocket.on('group-read-receipt', callback);
        }
    }

    emitGroupUpdate(groupId, updateType, payload) {
        if (this.groupSocket) {
            this.groupSocket.emit('group-update', {
                groupId,
                updateType,
                payload
            });
        }
    }

    onGroupUpdated(callback) {
        if (this.groupSocket) {
            this.groupSocket.on('group-updated', callback);
        }
    }

    onMemberRemoved(callback) {
        if (this.groupSocket) {
            this.groupSocket.on('member-removed', callback);
        }
    }

    // Remove specific listeners
    removeListener(event) {
        if (this.groupSocket) {
            this.groupSocket.off(event);
        }
    }

    // Cleanup Methods
    removeAllListeners() {
        if (this.groupSocket) {
            this.groupSocket.removeAllListeners();
        }
    }

    disconnect() {
        if (this.groupSocket) {
            this.groupSocket.disconnect();
            this.groupSocket = null;
        }
    }
}

export const socketService = new SocketService();