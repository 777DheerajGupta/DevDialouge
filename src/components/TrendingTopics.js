// src/components/TrendingTopics.js
import React, { useEffect, useState } from 'react';
import { fetchTrendingTopics } from '../api/topic';

const TrendingTopics = () => {
    const [trendingTopics, setTrendingTopics] = useState({
        github: [],
        news: [],
        reddit: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('github');

    useEffect(() => {
        const getTrendingTopics = async () => {
            setLoading(true);
            try {
                const data = await fetchTrendingTopics();
                console.log('trending topics ka data' , data)
                setTrendingTopics({
                    github: data.github ||[],
                    news: data.news || [],
                    reddit: data.reddit || []
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getTrendingTopics();
    }, []);

    const renderContent = () => {
        const content = {
            github: (
                <ul className="space-y-4">
                    {trendingTopics.github.map((repo) => (
                        <li 
                            key={repo.id} 
                            className="border p-4 rounded shadow hover:shadow-md transition-all duration-200 bg-white"
                        >
                            <h4 className="font-semibold">{repo.name}</h4>
                            <p className="text-gray-600">{repo.description || 'No description available.'}</p>
                            <div className="mt-2 flex items-center gap-4">
                                <a 
                                    href={repo.html_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-500 hover:underline"
                                >
                                    View Repository
                                </a>
                                <span className="text-sm text-gray-600">⭐ {repo.stargazers_count}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            ),
            reddit: (
                <ul className="space-y-4">
                    {trendingTopics.reddit.map((post) => (
                        <li 
                            key={post.id} 
                            className="border p-4 rounded shadow hover:shadow-md transition-all duration-200 bg-white"
                        >
                            <h4 className="font-semibold">{post.title}</h4>
                            {post.selftext && (
                                <p className="text-gray-600 mt-2">{post.selftext.slice(0, 200)}...</p>
                            )}
                            <div className="mt-2 flex items-center gap-4">
                                <a 
                                    href={`https://www.reddit.com${post.permalink}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-500 hover:underline"
                                >
                                    Read on Reddit
                                </a>
                                <span className="text-sm text-gray-600">
                                    r/{post.subreddit} • {post.author}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            ),
            news: (
                <ul className="space-y-4">
                    {trendingTopics.news.map((article, index) => (
                        <li 
                            key={index} 
                            className="border p-4 rounded shadow hover:shadow-md transition-all duration-200 bg-white"
                        >
                            <h4 className="font-semibold">{article.title}</h4>
                            <p className="text-gray-600 mt-2">{article.description || 'No description available.'}</p>
                            <div className="mt-2 flex items-center gap-4 flex-wrap">
                                <a 
                                    href={article.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-500 hover:underline"
                                >
                                    Read Article
                                </a>
                                {article.source?.name && (
                                    <span className="text-sm text-gray-600">
                                        Source: {article.source.name}
                                    </span>
                                )}
                                {article.author && (
                                    <span className="text-sm text-gray-600">
                                        By: {article.author}
                                    </span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )
        };

        return (
            <div className="animate-fadeIn">
                {content[activeTab]}
            </div>
        );
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Fixed Header and Tabs */}
            <div className="bg-white sticky top-0 z-10 p-4 border-b">
                <h2 className="text-2xl font-bold mb-6">Trending Programming Topics</h2>
                
                {/* Tab Navigation */}
                <div className="flex mb-2 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('github')}
                        className={`px-4 py-2 font-medium whitespace-nowrap ${
                            activeTab === 'github'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        GitHub
                        <span className="ml-2 text-sm text-gray-500">
                            ({trendingTopics.github.length})
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('reddit')}
                        className={`px-4 py-2 font-medium whitespace-nowrap ${
                            activeTab === 'reddit'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Reddit
                        <span className="ml-2 text-sm text-gray-500">
                            ({trendingTopics.reddit.length})
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('news')}
                        className={`px-4 py-2 font-medium whitespace-nowrap ${
                            activeTab === 'news'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        News
                        <span className="ml-2 text-sm text-gray-500">
                            ({trendingTopics.news.length})
                        </span>
                    </button>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-center p-4">
                            Error: {error}
                        </div>
                    ) : (
                        renderContent()
                    )}
                </div>
            </div>

            {/* Optional Scroll to Top Button - appears when scrolling down */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-opacity ${
                    window.scrollY > 200 ? 'opacity-100' : 'opacity-0'
                }`}
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                </svg>
            </button>
        </div>
    );
};

export default TrendingTopics;

// Add this CSS to your styles

