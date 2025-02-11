import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiConnector } from '../../api/apiConnector';
import { socketService } from '../../services/socketService';
import { toast } from 'react-hot-toast';
import GroupSettings from './GroupSettings';
import  io  from 'socket.io-client';

const GroupChat = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [group, setGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);
    const messagesContainerRef = useRef(null);
    const messagesEndRef = useRef(null);
    const settingsMenuRef = useRef(null);
    const socketRef = useRef();

    // Auto scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Scroll to bottom on initial load and when new messages are added
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch group details and messages
    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await apiConnector('GET', `/groups/${groupId}`);
                
                if (!response?.data?.data) {
                    throw new Error('Group not found');
                }

                const groupData = response.data.data;
                // console.log('group ka data', groupData.messages);
                // console.log('user' , user);
                
                // Check if user is a member or admin
                const isMember = groupData.members.some(
                    member => member.user._id === user.id
                );
                // console.log('member' , isMember);
                const isAdmin = groupData.admin.some(
                    admin => admin._id === user.id
                );

                if (!isMember && !isAdmin) {
                    throw new Error('You do not have access to this group');
                }

                setGroup(groupData);
                // console.log('groupdata messages', groupData);
                setMessages(groupData.messages || []);

            } catch (error) {
                console.error('Error fetching group details:', error);
                setError(error.message || 'Failed to load group');
                toast.error(error.message || 'Failed to load group');
                setTimeout(() => navigate('/groups'), 2000);
            } finally {
                setLoading(false);
            }
        };

        if (groupId && user?.id) {
            fetchGroupDetails();
        }

        return () => {
            socketService.removeAllListeners();
        };
    }, [groupId, user?.id, navigate]);

    // Socket connection for real-time updates


// Replace socket connection useEffect
useEffect(() => {
    if (!group || !user?.id) return;

    const socketUrl = "https://devdialouge-back.onrender.com/groups";
    
    socketRef.current = io(socketUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        auth: {
            token: localStorage.getItem('token')
        }
    });

    socketRef.current.on('connect', () => {
        console.log("Socket connected:", socketRef.current.id);
        
        // Join group room
        socketRef.current.emit('join-group', {
            userId: user.id,
           groupId: `group-${groupId}`
        });
    });

    socketRef.current.on('new-group-message', (data) => {
        console.log('Received message:', data);
        // Add message to state with proper structure
        const newMessage = {
            _id: data.message._id,
            content: data.message.content,
            sender: {
                _id: data.message.sender._id,
                name: data.message.sender.name,
                profilePicture: data.message.sender.profilePicture
            },
            createdAt: data.message.createdAt
        };
        
        setMessages(prev => [...prev, newMessage]);
        scrollToBottom();
    });

    socketRef.current.on('connect_error', (err) => {
        console.error("Socket connection error:", err);
    });

    return () => {
        if (socketRef.current) {
            socketRef.current.emit('leave-group', {
                userId: user.id,
                groupId: groupId
            });
            socketRef.current.disconnect();
        }
    };
}, [group, user?.id, groupId]);
    // useEffect(() => {
    //     if (!group || !user?.id) return;

    //     try {
    //         socketService.connectGroup();
    //         socketService.joinGroups([groupId]);

    //         socketService.onNewGroupMessage(({ message }) => {
    //             if (message) {
    //                 setMessages(prev => [...prev, message]);
    //                 scrollToBottom();
    //             }
    //         });

    //         socketService.onGroupUpdated(({ updateType, payload }) => {
    //             if (updateType === 'MEMBER_ADDED' || updateType === 'MEMBER_REMOVED') {
    //                 setGroup(prevGroup => ({
    //                     ...prevGroup,
    //                     members: payload.members
    //                 }));
    //             }
    //         });

    //     } catch (error) {
    //         console.error('Socket connection error:', error);
    //         toast.error('Failed to connect to chat service');
    //     }

    //     return () => {
    //         socketService.removeAllListeners();
    //     };
    // }, [group, user?.id, groupId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
    
        try {
            const response = await apiConnector('POST', `/groups/${groupId}/messages`, {
                content: newMessage
            });
    
            if (response?.data?.success) {

              
                // Create message object matching server format
                const newMessageObj = {
                    _id: response.data.data._id,
                    content: newMessage,
                    sender: {
                        _id: user.id,
                        name: user.name,
                        profilePicture: user.profilePicture
                    },
                    createdAt: new Date().toISOString()
                };
    
                // Update local state immediately
                // setMessages(prev => [...prev, newMessageObj]);
                
                // Emit to socket
                socketRef.current.emit('group-message', {
                    groupId,
                    content: newMessage,
                    sender: {
                        _id: user.id,
                        name: user.name,
                        profilePicture: user.profilePicture
                    },
                    createdAt: new Date().toISOString()
                });
    
                setNewMessage('');
                scrollToBottom();
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        }
    };
    

    useEffect(() => {
        function handleClickOutside(event) {
            if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
                setShowSettingsMenu(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Group Not Found</h2>
                    <p className="text-gray-600">The group you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-[#f0f2f5]">
            {/* Fixed Header */}
            <div className="flex-none bg-[#f0f2f5] border-b border-gray-200 p-3 flex justify-between items-center shadow-sm h-[60px]">
                <div className="flex items-center gap-3">
                    <img
                        src={group?.image || '/default-group.png'}
                        alt={group?.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            // e.target.src = '/default-group.png';
                        }}
                    />
                    <div>
                        <h2 className="font-medium text-[#111b21]">{group?.name}</h2>
                        <p className="text-sm text-[#667781] truncate max-w-[200px]">
                            {group?.members?.map(member => member.user.name).join(', ')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6 text-[#54656f]">
                    <button className="hover:text-[#111b21]">     
                        <i className="fas fa-search text-xl"></i>
                    </button>
                    <div className="relative" ref={settingsMenuRef}>
                        <button 
                            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                            className="hover:text-[#111b21]"
                        >
                            <i className="fas fa-ellipsis-v text-xl"></i>
                        </button>

                        {/* Settings Dropdown Menu */}
                        {showSettingsMenu && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg z-50 py-2">
                                <button
                                    onClick={() => {
                                        setShowSettings(true);
                                        setShowSettingsMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-[#111b21] hover:bg-[#f0f2f5] flex items-center gap-3"
                                >
                                    <i className="fas fa-cog text-[#54656f]"></i>
                                    Group settings
                                </button>
                                <button
                                    className="w-full px-4 py-2 text-left text-[#111b21] hover:bg-[#f0f2f5] flex items-center gap-3"
                                >
                                    <i className="fas fa-user-plus text-[#54656f]"></i>
                                    Add participants
                                </button>
                                <button
                                    className="w-full px-4 py-2 text-left text-[#111b21] hover:bg-[#f0f2f5] flex items-center gap-3"
                                >
                                    <i className="fas fa-info-circle text-[#54656f]"></i>
                                    Group info
                                </button>
                                <div className="border-t border-gray-200 my-1"></div>
                                <button
                                    className="w-full px-4 py-2 text-left text-red-500 hover:bg-[#f0f2f5] flex items-center gap-3"
                                >
                                    <i className="fas fa-sign-out-alt"></i>
                                    Exit group
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#efeae2]"
                style={{
                    backgroundImage: "url('/whatsapp-bg.png')",
                    backgroundRepeat: 'repeat',
                    height: 'calc(100vh - 130px)',
                    overflowY: 'auto',
                    scrollBehavior: 'smooth'
                }}
            >
                <div className="flex flex-col space-y-2">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <p className="text-[#667781]">No messages yet. Start the conversation!</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((message, index) => {
                            const isOwnMessage = message.sender?.id === user?.id;
                            return (
                                <div
                                    key={message._id || index}
                                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-fade-in`}
                                >
                                    <div className={`flex items-end gap-1 max-w-[65%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                                        {/* {!isOwnMessage && (
                                            <img
                                                src={message.sender?.profilePicture || '/default-avatar.png'}
                                                alt={message.sender?.name}
                                                className="w-8 h-8 rounded-full mb-1"
                                            />
                                        )} */}
                                        <div
                                            className={`rounded-lg p-2 shadow-sm relative ${
                                                isOwnMessage 
                                                    ? 'bg-[#d9fdd3] text-[#111b21]' 
                                                    : 'bg-white text-[#111b21]'
                                            }`}
                                        >
                                            {!isOwnMessage && (
                                                <p className="text-xs font-medium text-[#1fa855] mb-1">
                                                    {message.sender?.name}
                                                </p>
                                            )}
                                            <p className="text-sm break-words">{message.content}</p>
                                            <div className="flex items-center justify-end gap-1 mt-1">
                                                <span className="text-[10px] text-[#667781]">
                                                {message.createdAt ? 
                                               new Date(message.createdAt).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                      minute: '2-digit',
                                                     hour12: true
                                                 }) 
                                                 : 'Invalid date'
                                             }
                                                
                                                </span>
                                                {isOwnMessage && (
                                                    <i className="fas fa-check-double text-[10px] text-[#53bdeb]"></i>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-[#f0f2f5] p-3">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <button
                        type="button"
                        className="text-[#54656f] hover:text-[#111b21] p-2"
                    >
                        <i className="far fa-smile text-xl"></i>
                    </button>
                    <button
                        type="button"
                        className="text-[#54656f] hover:text-[#111b21] p-2"
                    >
                        <i className="fas fa-paperclip text-xl"></i>
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message"
                        className="flex-1 bg-white rounded-lg px-4 py-2 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                            newMessage.trim()
                                ? 'bg-[#00a884] text-white hover:bg-[#017561]'
                                : 'bg-[#8696a0] cursor-not-allowed'
                        }`}
                    >
                        {newMessage.trim() ? (
                            <i className="fas fa-paper-plane"></i>
                        ) : (
                            <i className="fas fa-microphone"></i>
                        )}
                    </button>
                </form>
            </div>

            {/* Group Settings Modal */}
            {showSettings && (
                <GroupSettings
                    group={group}
                    onClose={() => setShowSettings(false)}
                    onUpdate={(updatedGroup) => setGroup(updatedGroup)}
                />
            )}
        </div>
    );
};

export default GroupChat;
