# DevDialogue 💬

<div align="center">

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow.svg)](https://www.javascript.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-13AA52?logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/RealTime-Socket.io-010101?logo=socket.io)](https://socket.io/)
[![Deployed](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel)](https://dev-dialouge-frontend.vercel.app/)

**A dynamic platform for developers to engage, collaborate, and stay informed**

[Live Demo](https://dev-dialouge-frontend.vercel.app/) • [Report Bug](https://github.com/777DheerajGupta/DevDialouge/issues) • [Request Feature](https://github.com/777DheerajGupta/DevDialouge/issues)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [Future Improvements](#future-improvements)
- [License](#license)
- [Support](#support)

---

## 🎯 About

**DevDialogue** is a vibrant community platform designed for developers to connect, collaborate, and grow together. It provides a seamless experience for sharing knowledge, asking questions, discussing trending topics, and building meaningful professional relationships.

The platform integrates **AI-powered assistance from Google Gemini** and aggregates the **latest programming trends** from GitHub, Reddit, and news sources, ensuring developers stay at the forefront of technology.

Whether you're a beginner seeking guidance or an experienced developer sharing expertise, DevDialogue fosters a collaborative environment for the entire developer community.

---

## ✨ Features

### Core Features
- 🗣️ **Real-time Chat**: Private one-to-one messaging with instant notifications
- 👥 **Group Conversations**: Create and manage group chats with multiple members
- 📝 **Discussion Posts**: Share thoughts, ideas, and experiences with the community
- ❓ **Question & Answers**: Ask questions and provide solutions within a structured format
- 🏷️ **Tagging System**: Organize content with relevant tags for better discoverability
- 📊 **Post Ratings**: Community voting system to highlight quality content

### AI & Trending Features
- 🤖 **Gemini AI Integration**: Get AI-powered assistance and suggestions
- 📈 **Trending Topics**: Discover the latest programming trends and discussions
- 🔗 **GitHub Integration**: Access trending repositories and discussions
- 🔴 **Reddit Integration**: Follow popular programming communities
- 📰 **News Aggregation**: Stay updated with the latest tech news

### Social Features
- 👤 **User Profiles**: Customize your profile with avatar and bio
- ❤️ **Follow System**: Follow developers and stay updated with their activity
- 🔔 **Notifications**: Real-time notifications for interactions
- 💬 **Comments**: Comment on posts and engage in discussions
- ⭐ **User Ratings**: Build your reputation in the community

### User Experience
- 🎨 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🔐 **Secure Authentication**: JWT-based authentication with encrypted passwords
- ⚡ **Fast Performance**: Optimized for speed and smooth user experience
- 🎯 **Intuitive Interface**: User-friendly design for all skill levels

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18.2.0](https://react.dev/) - UI library
- **Routing**: [React Router 6.27.0](https://reactrouter.com/) - Client-side navigation
- **State Management**: [Redux Toolkit 2.3.0](https://redux-toolkit.js.org/) & [React-Redux 9.1.2](https://react-redux.js.org/)
- **Styling**: [Tailwind CSS 3.4.14](https://tailwindcss.com/) - Utility-first CSS
- **Icons**: [Heroicons 2.1.5](https://heroicons.com/) & [Font Awesome 6.6.0](https://fontawesome.com/)
- **HTTP Client**: [Axios 1.7.7](https://axios-http.com/) - API communication
- **Real-time**: [Socket.IO Client 4.8.1](https://socket.io/) - WebSocket communication
- **Notifications**: [React Hot Toast 2.4.1](https://react-hot-toast.com/) & [React-Toastify 10.0.6](https://fkhadra.github.io/react-toastify/introduction)
- **Utilities**: [Lodash 4.17.21](https://lodash.com/) & [JWT Decode 4.0.0](https://github.com/auth0/jwt-decode)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) - JavaScript runtime
- **Framework**: [Express 4.21.1](https://expressjs.com/) - Web framework
- **Database**: [MongoDB 8.7.2](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM
- **Real-time**: [Socket.IO 4.8.0](https://socket.io/) - WebSocket library
- **AI/ML**: [@google/generative-ai 0.21.0](https://ai.google.dev/) - Gemini API
- **Authentication**: [JWT 9.0.2](https://jwt.io/) & [bcryptjs 2.4.3](https://github.com/dcodeIO/bcrypt.js)
- **File Upload**: [Cloudinary 2.5.1](https://cloudinary.com/) - Cloud image management
- **Utilities**:
  - [Express-validator 7.2.0](https://express-validator.github.io/docs/) - Input validation
  - [CORS 2.8.5](https://github.com/expressjs/cors) - Cross-origin resource sharing
  - [Dotenv 16.4.5](https://github.com/motdotla/dotenv) - Environment variables
  - [Morgan 1.10.0](https://github.com/expressjs/morgan) - HTTP logging
  - [Nodemailer 6.9.15](https://nodemailer.com/) - Email service
  - [Express Rate Limit 7.4.1](https://github.com/nfriedly/express-rate-limit) - Rate limiting
  - [Node Cache 5.1.2](https://github.com/node-cache/node-cache) - In-memory caching

### Development Tools
- **Build Tool**: [React Scripts 5.0.1](https://create-react-app.dev/)
- **Process Manager**: [Nodemon 3.1.7](https://nodemon.io/) - Auto-restart on file changes
- **Concurrency**: [Concurrently 9.1.2](https://github.com/open-cli-tools/concurrently) - Run multiple scripts

---

## 📥 Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local instance or MongoDB Atlas cloud database)
- **Google Generative AI API Key** (Gemini)
- **Cloudinary Account** (for image uploads)

### Step 1: Clone the Repository

```bash
git clone https://github.com/777DheerajGupta/DevDialouge.git
cd DevDialouge
```

### Step 2: Install Dependencies

#### Install Frontend Dependencies
```bash
npm install
```

#### Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory and a `.env` file in the `server` directory with the required variables (see [Environment Variables](#environment-variables) section).

### Step 4: Start the Application

#### Option A: Run Frontend and Backend Concurrently
```bash
npm run dev
```

This command will:
- Start the React frontend on `http://localhost:3000`
- Start the Node.js backend on `http://localhost:10000`

#### Option B: Run Separately

**Frontend only:**
```bash
npm run client
```

**Backend only:**
```bash
cd server && npm run dev
```

### Step 5: Open Your Browser

Navigate to `http://localhost:3000` and start exploring DevDialogue!

---

## 🔐 Environment Variables

### Frontend `.env` (Root Directory)

```env
# Add frontend-specific environment variables here if needed
# Example: API base URL for different environments
# REACT_APP_API_URL=http://localhost:10000/api/v1
```

### Backend `.env` (Server Directory)

Create a `.env` file in the `server` directory with the following variables:

```env
# Database Configuration
MONGODB_URL=mongodb://username:password@host:port/database_name
# or for MongoDB Atlas
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name

# Server Configuration
PORT=10000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d

# Google Generative AI (Gemini)
GEMINI_API_KEY=your_google_generative_ai_api_key

# Cloudinary Configuration (for image uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (Optional - for notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password_or_app_password

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### Getting API Keys

#### MongoDB Atlas
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string

#### Google Generative AI (Gemini)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and paste it in your `.env`

#### Cloudinary
1. Visit [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Find your API credentials in the dashboard

---

## 🚀 Usage

### Running the Application

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately
npm run client       # Terminal 1: Frontend
cd server && npm run dev  # Terminal 2: Backend
```

### Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:10000/api/v1
- **WebSocket**: http://localhost:10000 (for real-time features)

### Common Workflows

#### 1. Creating a User Account
1. Navigate to the registration page
2. Enter your email, username, and password
3. Verify your email (if configured)
4. Start exploring!

#### 2. Posting in the Community
1. Click on "New Post"
2. Write your content
3. Add relevant tags
4. Click "Publish"

#### 3. Starting a Private Chat
1. Search for a user
2. Click their profile
3. Click "Send Message"
4. Start chatting in real-time

#### 4. Creating a Group Chat
1. Click "New Group"
2. Add group members
3. Set a group name
4. Create and start collaborating

#### 5. Using AI Assistance
1. Click on "Ask Gemini"
2. Describe your question or task
3. Get AI-powered suggestions

---

## 📁 Folder Structure

```
DevDialouge/
├── public/                    # Static files served by React
├── src/                       # Frontend source code
│   ├── components/           # Reusable React components
│   ├── pages/               # Page components for routes
│   ├── redux/               # Redux store, slices, and actions
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API service calls
│   ├── styles/              # Global styles and Tailwind config
│   ├── utils/               # Utility functions
│   ├── App.js              # Main App component
│   └── index.js            # React entry point
├── server/                   # Backend source code
│   ├── config/              # Configuration files
│   │   ├── cloudinary.js   # Cloudinary setup
│   │   ├── chatSocket.js   # Private chat Socket.IO config
│   │   └── groupSocket.js  # Group chat Socket.IO config
│   ├── routes/              # API route handlers
│   │   ├── authRoutes.js   # Authentication endpoints
│   │   ├── postRoutes.js   # Post management
│   │   ├── questionRoutes.js # Q&A endpoints
│   │   ├── solutionRoutes.js # Solution endpoints
│   │   ├── commentRoutes.js  # Comment endpoints
│   │   ├── userRoutes.js    # User profile endpoints
│   │   ├── chatRoutes.js    # Chat endpoints
│   │   ├── notificationRoutes.js # Notifications
│   │   ├── followRoutes.js  # Follow/unfollow system
│   │   ├── groupRoutes.js   # Group chat endpoints
│   │   ├── tagRoutes.js     # Tag management
│   │   ├── ratingRoutes.js  # Rating system
│   │   ├── geminiRoutes.js  # AI assistant
│   │   └── trendingRoutes.js # Trending content
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Question.js
│   │   ├── Solution.js
│   │   ├── Comment.js
│   │   ├── Chat.js
│   │   ├── Notification.js
│   │   └── Group.js
│   ├── middleware/          # Express middleware
│   │   ├── auth.js         # JWT authentication
│   │   ├── errorHandler.js # Error handling
│   │   └── validation.js   # Input validation
│   ├── controllers/         # Business logic
│   ├── utils/              # Utility functions
│   ├── index.js            # Server entry point
│   ├── package.json        # Backend dependencies
│   └── .env                # Environment variables
├── .env                     # Frontend environment variables
├── .gitignore             # Git ignore rules
├── package.json           # Frontend dependencies
├── package-lock.json      # Dependency lock file
├── tailwind.config.js     # Tailwind CSS config
└── README.md              # This file
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/signup` | Register a new user |
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/logout` | User logout |
| POST | `/api/v1/auth/refresh-token` | Refresh JWT token |
| POST | `/api/v1/auth/forgot-password` | Initiate password reset |
| POST | `/api/v1/auth/reset-password` | Reset password with token |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/:id` | Get user profile |
| PUT | `/api/v1/users/:id` | Update user profile |
| GET | `/api/v1/users` | List all users |
| DELETE | `/api/v1/users/:id` | Delete user account |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/posts` | Get all posts (paginated) |
| GET | `/api/v1/posts/:id` | Get single post |
| POST | `/api/v1/posts` | Create a new post |
| PUT | `/api/v1/posts/:id` | Update post |
| DELETE | `/api/v1/posts/:id` | Delete post |
| POST | `/api/v1/posts/:id/like` | Like a post |
| DELETE | `/api/v1/posts/:id/like` | Unlike a post |

### Questions & Answers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/questions` | Get all questions |
| POST | `/api/v1/questions` | Post a question |
| GET | `/api/v1/questions/:id` | Get question details |
| PUT | `/api/v1/questions/:id` | Update question |
| DELETE | `/api/v1/questions/:id` | Delete question |
| POST | `/api/v1/solutions` | Post a solution |
| PUT | `/api/v1/solutions/:id` | Update solution |
| DELETE | `/api/v1/solutions/:id` | Delete solution |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/comments/:postId` | Get comments for a post |
| POST | `/api/v1/comments` | Add a comment |
| PUT | `/api/v1/comments/:id` | Update comment |
| DELETE | `/api/v1/comments/:id` | Delete comment |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/chat/conversations` | Get user conversations |
| GET | `/api/v1/chat/:userId` | Get chat history |
| POST | `/api/v1/chat/send` | Send a message |
| DELETE | `/api/v1/chat/:messageId` | Delete a message |

### Groups
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/groups` | Get user groups |
| POST | `/api/v1/groups` | Create a group |
| PUT | `/api/v1/groups/:id` | Update group |
| DELETE | `/api/v1/groups/:id` | Delete group |
| POST | `/api/v1/groups/:id/members` | Add members |
| DELETE | `/api/v1/groups/:id/members/:userId` | Remove member |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/notifications` | Get user notifications |
| PUT | `/api/v1/notifications/:id/read` | Mark as read |
| DELETE | `/api/v1/notifications/:id` | Delete notification |

### Follow System
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/follow/:userId` | Follow a user |
| DELETE | `/api/v1/follow/:userId` | Unfollow a user |
| GET | `/api/v1/follow/:userId/followers` | Get followers |
| GET | `/api/v1/follow/:userId/following` | Get following list |

### Ratings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/ratings` | Rate content |
| GET | `/api/v1/ratings/:contentId` | Get ratings for content |

### AI Assistant (Gemini)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/gemini/ask` | Ask Gemini AI |
| POST | `/api/v1/gemini/code-review` | Get code review from AI |
| POST | `/api/v1/gemini/explain` | Get explanation from AI |

### Trending
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/trending/posts` | Get trending posts |
| GET | `/api/v1/trending/topics` | Get trending topics |
| GET | `/api/v1/trending/github` | Get trending GitHub repos |
| GET | `/api/v1/trending/reddit` | Get trending Reddit discussions |
| GET | `/api/v1/trending/news` | Get latest tech news |

---

## 📸 Screenshots

### Dashboard & Home

<div align="center">

![Dashboard Screenshot Placeholder](https://via.placeholder.com/800x600?text=DevDialogue+Dashboard)

*Main dashboard showing feed, trending topics, and suggestions*

</div>

### Discussion Posts

<div align="center">

![Posts Screenshot Placeholder](https://via.placeholder.com/800x600?text=Discussion+Posts)

*Create and browse community discussion posts*

</div>

### Real-time Chat

<div align="center">

![Chat Screenshot Placeholder](https://via.placeholder.com/800x600?text=Real-time+Chat)

*Private and group messaging with real-time updates*

</div>

### Q&A Section

<div align="center">

![Q&A Screenshot Placeholder](https://via.placeholder.com/800x600?text=Questions+and+Answers)

*Ask questions and get solutions from the community*

</div>

### User Profile

<div align="center">

![Profile Screenshot Placeholder](https://via.placeholder.com/800x600?text=User+Profile)

*Personalized user profile with activity and achievements*

</div>

### AI Assistant

<div align="center">

![Gemini AI Screenshot Placeholder](https://via.placeholder.com/800x600?text=Gemini+AI+Assistant)

*Get AI-powered help and suggestions*

</div>

**Note**: Replace placeholder images with actual screenshots from your application.

---

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Contributing to DevDialogue is a great way to learn, teach, and build experience.

### Getting Started with Contributing

1. **Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/DevDialouge.git
   cd DevDialouge
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   # or for bug fixes
   git checkout -b fix/bug-description
   ```

4. **Make Your Changes**
   - Follow the existing code style and patterns
   - Write clear, descriptive commit messages
   - Test your changes thoroughly

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: Add amazing feature" 
   # or
   git commit -m "fix: Resolve bug description"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Create a Pull Request**
   - Go to GitHub and click "New Pull Request"
   - Provide a clear description of your changes
   - Reference any related issues

### Contribution Guidelines

- **Code Quality**: Follow the existing code style and best practices
- **Comments**: Add comments for complex logic
- **Testing**: Test your code before submitting
- **Documentation**: Update docs for new features
- **Commit Messages**: Use descriptive, conventional commit messages:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `style:` for code style changes
  - `refactor:` for refactoring
  - `test:` for tests

### Areas to Contribute

- **Bug Fixes**: Fix reported issues
- **Features**: Implement requested features
- **Documentation**: Improve README and inline comments
- **Tests**: Add unit and integration tests
- **UI/UX**: Improve design and user experience
- **Performance**: Optimize code and database queries
- **Accessibility**: Improve accessibility features

### Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Report issues responsibly
- No harassment or discrimination

---

## 🚀 Future Improvements

### Planned Features
- [ ] **Video Calling**: Integrate video chat for real-time communication
- [ ] **Screen Sharing**: Share screens during discussions
- [ ] **Code Highlighting**: Better syntax highlighting for code snippets
- [ ] **Advanced Search**: Full-text search with filters
- [ ] **Bookmarks**: Save and organize favorite posts
- [ ] **User Badges**: Achievement system with badges
- [ ] **Dark Mode**: Dark theme support
- [ ] **Mobile App**: Native iOS and Android applications
- [ ] **Webhooks**: Custom integrations and webhooks
- [ ] **Analytics**: User engagement and community analytics

### Performance Optimizations
- [ ] Implement caching strategies
- [ ] Lazy loading for images
- [ ] API response pagination optimization
- [ ] Database query optimization
- [ ] CDN integration for static assets

### Security Enhancements
- [ ] Two-factor authentication (2FA)
- [ ] OAuth integration (Google, GitHub)
- [ ] Rate limiting improvements
- [ ] Security audit and penetration testing
- [ ] DDoS protection

### Community Features
- [ ] Mentorship program
- [ ] Coding challenges
- [ ] Hackathon integration
- [ ] Certification programs
- [ ] Community guidelines and moderation

### Mobile & Responsive
- [ ] Progressive Web App (PWA)
- [ ] Better mobile experience
- [ ] Offline functionality
- [ ] Push notifications

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

The ISC License is a simple and permissive open-source license that allows you to use, modify, and distribute this software freely, as long as you include the original copyright and license notice.

---

## 📞 Support

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/777DheerajGupta/DevDialouge/issues) - Report bugs and request features
- **Discussions**: [GitHub Discussions](https://github.com/777DheerajGupta/DevDialouge/discussions) - Ask questions and discuss ideas
- **Email**: Contact the maintainers directly

### Troubleshooting

#### Cannot connect to MongoDB
- Verify connection string in `.env`
- Check if MongoDB server is running
- Ensure network access is allowed (for MongoDB Atlas)

#### Real-time chat not working
- Check if Socket.IO is properly configured
- Verify CORS settings for your domain
- Check browser console for errors

#### Image upload failing
- Verify Cloudinary credentials
- Check file size limits
- Ensure correct MIME types

#### API errors
- Check error logs in server console
- Verify all required environment variables are set
- Check network tab in browser developer tools

### Documentation

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 👨‍💻 Author

**Dheeraj Gupta**
- GitHub: [@777DheerajGupta](https://github.com/777DheerajGupta)
- Live Demo: [DevDialogue](https://dev-dialouge-frontend.vercel.app/)

---

## 🙏 Acknowledgments

- Thanks to all contributors who help improve DevDialogue
- Google Generative AI for powering the AI features
- MongoDB for the database solution
- Socket.IO for real-time communication
- The open-source community for amazing libraries and tools

---

<div align="center">

**[⬆ Back to Top](#devdialogue-)**

Made with ❤️ by developers, for developers

</div>
