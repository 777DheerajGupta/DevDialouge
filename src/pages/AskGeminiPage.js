import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { apiConnector } from '../api/apiConnector';
import { useNavigate } from 'react-router-dom';

const AskGeminiPage = () => {
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const messagesEndRef = useRef(null);

    // 2. Get all user's chats on mount
    useEffect(() => {
        fetchChats();
    }, []);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 2. Get all user's chats
    const fetchChats = async () => {
        try {
            const response = await apiConnector('GET', '/gemini/chats');
            if (response.data.success) {
                setChats(response.data.data);
                // Load first chat if exists
                if (response.data.data.length > 0) {
                    await loadChat(response.data.data[0]._id);
                }
            }
        } catch (error) {
            console.error('Error fetching chats:', error);
            toast.error('Failed to load chat history');
        }
    };

    // 3. Get a specific chat's history
    const loadChat = async (chatId) => {
        try {
            const response = await apiConnector('GET', `/gemini/chats/${chatId}`);
            // console.log('load chat response' , response.data.data)
            if (response.data.success) {
                setCurrentChat(response.data.data);
                setMessages(response.data.data.messages);
            }
        } catch (error) {
            console.error('Error loading chat:', error);
            toast.error('Failed to load chat messages');
        }
    };

    // 1. Create a new chat session
    const handleNewChat = async () => {
        try {
            const response = await apiConnector('POST', '/gemini/chats', {});
            console.log('New chat response:', response);
            
            if (response.data.success) {
                const newChat = response.data.data;
                setChats(prev => [newChat, ...prev]);
                setCurrentChat(newChat);
                setMessages([]);
                toast.success('New chat created');
            }
        } catch (error) {
            console.error('Error creating new chat:', error);
            toast.error(error.message || 'Failed to create new chat');
        }
    };

    // 4. Send a message in a specific chat
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentChat) return;

        try {
            setIsLoading(true);
            
            // Log the current chat ID and message
            console.log('Sending to chat:', currentChat._id);
            console.log('Message:', newMessage);

            const response = await apiConnector(
                'POST',
                `/gemini/chats/${currentChat._id}/messages`,
                { "message": newMessage }
            );

            console.log('Gemini Response:', response);

            if (response.data.success) {
                const aiMessage = {
                    role: 'assistant',
                    content: response.data.data.message,
                    timestamp: new Date().toISOString()
                };

                setMessages(prev => [...prev, {
                    role: 'user',
                    content: newMessage,
                    timestamp: new Date().toISOString()
                }, aiMessage]);
                
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Failed to send message');
        } finally {
            setIsLoading(false);
        }
    };

    // 5. Delete a specific chat
    const handleDeleteChat = async (chatId) => {
        try {
            const response = await apiConnector('DELETE', `/gemini/chats/${chatId}`);
            console.log('delete response' , response)
            if (response.data.success) {
                setChats(prev => prev.filter(chat => chat._id !== chatId));
                if (currentChat?._id === chatId) {
                    setCurrentChat(null);
                    setMessages([]);
                }
                toast.success('Chat deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
            toast.error('Failed to delete chat');
        }
    };

    // 6. Clear all chats
    const handleClearAllChats = async () => {
        try {
            const response = await apiConnector('DELETE', '/gemini/chats');
            if (response.success) {
                setChats([]);
                setCurrentChat(null);
                setMessages([]);
                toast.success('All chats cleared successfully');
            }
        } catch (error) {
            console.error('Error clearing chats:', error);
            toast.error('Failed to clear all chats');
        }
    };

    return (
        <div className="h-screen flex">
            {/* Sidebar */}
            <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-gray-900 text-white transition-all duration-300 overflow-hidden flex flex-col`}>
                <div className="p-4 border-b border-gray-700">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <i className="fas fa-arrow-left"></i>
                        Back to Home
                    </button>
                </div>

                <div className="p-4">
                    <button
                        onClick={handleNewChat}
                        className="w-full py-3 px-4 rounded-lg border border-white/20 hover:bg-gray-700 transition-colors flex items-center gap-3"
                    >
                        <i className="fas fa-plus"></i>
                        New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto chat-sidebar-scrollbar">
                    {chats.map(chat => (
                        <div key={chat._id} className="group relative">
                            <button
                                onClick={() => loadChat(chat._id)}
                                className={`w-full p-3 text-left hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                                    currentChat?._id === chat._id ? 'bg-gray-700' : ''
                                }`}
                            >
                                <i className="fas fa-message"></i>
                                <span className="truncate">
                                    {chat.title || 'New Chat'}
                                </span>
                            </button>
                            <button
                                onClick={() => handleDeleteChat(chat._id)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500 rounded"
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    ))}
                </div>

                {chats.length > 0 && (
                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={handleClearAllChats}
                            className="w-full py-2 px-4 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2 justify-center"
                        >
                            <i className="fas fa-trash-alt"></i>
                            Clear All Chats
                        </button>
                    </div>
                )}
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(prev => !prev)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <i className="fas fa-bars"></i>
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                        >
                            <i className="fas fa-arrow-left"></i>
                            Back
                        </button>
                    </div>
                    <h1 className="text-xl font-semibold">Gemini AI</h1>
                    <div className="w-8"></div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`max-w-3xl mx-auto mb-6 ${
                                message.role === 'assistant' ? 'bg-white' : 'bg-blue-50'
                            } rounded-lg p-4 shadow-sm`}
                        >
                            <div className="flex items-start space-x-3">
                                {message.role === 'assistant' ? (
                                    <div className="flex-shrink-0">
                                        <img 
                                            src="/gemini-logo.png" 
                                            alt="Gemini" 
                                            className="w-6 h-6 rounded-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex-shrink-0">
                                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                                            <span className="text-xs text-white">U</span>
                                        </div>
                                    </div>
                                )}
                                <div className="flex-1 space-y-2">
                                    <div className="font-medium text-sm">
                                        {message.role === 'assistant' ? 'Gemini AI' : 'You'}
                                    </div>
                                    <div className="prose prose-sm max-w-none">
                                        {message.content.split('\n').map((line, i) => (
                                            <p key={i} className="mb-2">
                                                {line}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t bg-white p-4">
                    <form 
                        onSubmit={handleSendMessage} 
                        className="max-w-3xl mx-auto"
                    >
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Message Gemini..."
                                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim() || isLoading}
                                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                                    !newMessage.trim() || isLoading
                                        ? 'bg-gray-100 text-gray-400'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        <span>Thinking...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-paper-plane"></i>
                                        <span>Send</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AskGeminiPage;