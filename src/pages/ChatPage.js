import React, { useEffect, useState, useRef } from 'react';
import { apiConnector } from '../api/apiConnector';
import ChatMessage from '../components/ChatMessage';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const messageStyles = {
  sentMessage: `flex justify-end mb-4`,
  receivedMessage: `flex justify-start mb-4`,
  sentBubble: `bg-[#DCF8C6] text-black rounded-lg p-3 max-w-[70%] rounded-tr-none shadow`,
  receivedBubble: `bg-white text-black rounded-lg p-3 max-w-[70%] rounded-tl-none shadow`,
  timestamp: `text-[11px] text-gray-500 mt-1`,
  readStatus: `text-[11px] text-gray-500 ml-1`,
};

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef();
  const currentUser = useSelector(state => state.auth.user);
  const messagesEndRef = useRef(null);

  const [activeTab, setActiveTab] = useState('direct');
  const [recentGroups, setRecentGroups] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiConnector('GET', '/users/all');
        // console.log('users response', response.data.data);
        const filteredUsers = response.data.data.filter(
          user => user._id !== currentUser.id
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
      }
    };

    if (currentUser?.id) {
      fetchUsers();
    }
  }, [currentUser.id]);

  useEffect(() => {
    const fetchRecentGroups = async () => {
      try {
        const response = await apiConnector('GET', '/groups/all');
        console.log(" groups response", response.data.data);
        setRecentGroups(response.data.data);
      } catch (error) {
        console.error('Error fetching recent groups:', error);
      }
    };

    if (activeTab === 'groups') {
      fetchRecentGroups();
    }
  }, [activeTab]);

  useEffect(() => {
    console.log("selectedUser", selectedUser);
    if (!selectedUser) return;

    // Mark messages as read when chat is opened
    markMessagesAsRead(selectedUser._id);

    // Initialize socket connection
    socketRef.current = io(process.env.REACT_APP_BASE_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    // Join private room
    socketRef.current.emit('join', {
      userId: currentUser._id,
      recipientId: selectedUser._id
    });

    // Fetch chat history
    const fetchChatHistory = async () => {
      try {
        const response = await apiConnector('GET', `/chat/history/${selectedUser._id}`);
        if (response.data) {
          const formattedMessages = response.data.data.messages.map(msg => ({
            ...msg,
            status: msg.sender === currentUser._id ? 'sent' : 'received',
            read: Boolean(msg.read)
          }));
          setMessages(formattedMessages);
          scrollToBottom();
        }
        setConnected(true);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [selectedUser, currentUser._id]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!selectedUser || newMessage.trim() === '') return;

    const messageData = {
      content: newMessage.trim(),
      recipient: selectedUser._id,
    };

    try {
      // Send to backend first
      const response = await apiConnector('POST', '/chat/private', messageData);
      
      if (response.data.success) {
        // Add message to local state
        const fullMessage = {
          ...response.data.data,
          sender: currentUser._id,
          timestamp: new Date().toISOString(),
        };
        
        setMessages(prevMessages => [...prevMessages, fullMessage]);
        
        // Send through socket
        socketRef.current.emit('private-message', fullMessage);
        
        // Clear input
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // You might want to show an error notification to the user
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Mark messages as read
  const markMessagesAsRead = async (senderId) => {
    try {
      await apiConnector('PUT', `/chat/read/${senderId}`);
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.sender === senderId ? { ...msg, read: true } : msg
        )
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  return (
    <div className="h-screen flex bg-[#f0f2f5]">
        {/* Left Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Fixed Header */}
            <div className="p-4 bg-white border-b flex-none">
                <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate('/chat')}
                            className={`text-xl font-semibold px-4 py-2 rounded-lg transition-colors ${
                                location.pathname === '/chat'
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                        >
                            Chats
                        </button>
                        <button
                            onClick={() => navigate('/groups')}
                            className={`text-xl font-semibold px-4 py-2 rounded-lg transition-colors ${
                                location.pathname === '/groups'
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                        >
                            Groups
                        </button>
                    </div>
                    
                  
                </div>
            </div>

            

            {/* Tabs */}
            <div className="flex bg-white flex-none">
                <button
                    className={`flex-1 py-3 text-center ${
                        activeTab === 'direct'
                            ? 'text-[#00a884] border-b-2 border-[#00a884]'
                            : 'text-[#54656f]'
                    }`}
                    onClick={() => setActiveTab('direct')}
                >
                    Direct Messages
                </button>
                <button
                    className={`flex-1 py-3 text-center ${
                        activeTab === 'groups'
                            ? 'text-[#00a884] border-b-2 border-[#00a884]'
                            : 'text-[#54656f]'
                    }`}
                    onClick={() => {
                      setActiveTab('groups');
                    }}
                >
                    Group Chats
                </button>
            </div>

            {/* Scrollable Chat List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                {activeTab === 'direct' ? (
                    <div className="space-y-1 p-2">
                        {users.map((user) => (
                            <div
                                key={user._id}
                                onClick={() => setSelectedUser(user)}
                                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                                    selectedUser?._id === user._id ? 'bg-[#f0f2f5]' : ''
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={user.profilePicture || '/default-avatar.png'}
                                        alt={user.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-medium text-[#111b21]">{user.name}</p>
                                        <p className="text-sm text-[#667781]">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-1 p-2">
                        {recentGroups.map((group) => (
                            <Link
                                key={group._id}
                                to={`/groups/${group._id}`}
                                className="p-3 rounded-lg hover:bg-gray-100 flex items-center gap-3 transition-colors"
                            >
                                <div className="w-12 h-12 bg-[#00a884] rounded-full flex items-center justify-center text-white font-medium">
                                    {group.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-[#111b21]">{group.name}</p>
                                    <p className="text-sm text-[#667781]">
                                        {group.members.length} members
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Right Chat Area */}
        <div className="flex-1 flex flex-col">
            {selectedUser ? (
                <>
                    {/* Chat Header */}
                    <div className="p-4 bg-[#f0f2f5] border-b flex items-center gap-3 flex-none">
                        <img
                            src={selectedUser.profilePicture || '/default-avatar.png'}
                            alt={selectedUser.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <h3 className="font-medium text-[#111b21]">{selectedUser.name}</h3>
                            <p className="text-sm text-[#667781]">
                                {selectedUser.isOnline ? 'Online' : 'Offline'}
                            </p>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-[#efeae2]">
                        <div className="max-w-[950px] mx-auto space-y-2">
                            {messages.map((msg, index) => (
                                <ChatMessage
                                    key={index}
                                    message={msg}
                                    isOwnMessage={msg.sender === currentUser._id}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Message Input */}
                    <div className="p-4 bg-[#f0f2f5] flex-none">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message"
                                className="flex-1 px-4 py-2 rounded-lg border-none focus:ring-1 focus:ring-[#00a884]"
                            />
                            <button
                                type="submit"
                                className="bg-[#00a884] text-white px-4 py-2 rounded-lg hover:bg-[#008f72] transition-colors"
                                disabled={!newMessage.trim()}
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-[#f0f2f5] text-[#667781]">
                    Select a chat to start messaging
                </div>
            )}
        </div>
    </div>
  );
};

export default ChatPage;
