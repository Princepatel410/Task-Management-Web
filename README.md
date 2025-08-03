# Task Management Application

A full-stack task management web application built with modern technologies for efficient task organization and productivity.

## 🚀 Features

### Core Features
- **User Authentication**: Secure JWT-based authentication with registration and login
- **Task Management**: Complete CRUD operations for tasks
- **Real-time Updates**: Live task updates using Socket.io
- **Responsive Design**: Modern, mobile-friendly UI with Tailwind CSS
- **Task Filtering**: Filter tasks by status (Todo, In Progress, Completed)
- **Priority Levels**: Set task priorities (Low, Medium, High)
- **Due Dates**: Set and track task deadlines
- **Task Statistics**: Visual progress tracking and analytics
- **Search & Sort**: Advanced task filtering and sorting options

### Technical Features
- **Full-Stack Architecture**: Next.js frontend with Node.js/Express backend
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Real-time Communication**: Socket.io for live updates
- **API Security**: Rate limiting, input validation, and CORS protection
- **TypeScript**: Type-safe development experience
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Socket.io Client** - Real-time communication
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time bidirectional communication
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
task-management-app/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/             # Authentication components
│   └── dashboard/        # Dashboard components
├── contexts/             # React contexts
│   ├── AuthContext.tsx   # Authentication context
│   └── TaskContext.tsx   # Task management context
├── server/               # Backend server
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   ├── middleware/       # Custom middleware
│   ├── server.js         # Main server file
│   └── package.json      # Backend dependencies
├── package.json          # Frontend dependencies
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management-app
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/task-management-app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:3000
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud service)
   ```

6. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

7. **Start the frontend development server**
   ```bash
   # In a new terminal
   npm run dev
   ```

8. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

### Task Endpoints

#### Get All Tasks
```
GET /api/tasks
Authorization: Bearer <token>
Query Parameters:
- status: todo|in-progress|completed
- priority: low|medium|high
- sort: createdAt|dueDate|priority|title
- order: asc|desc
```

#### Create Task
```
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management app",
  "status": "todo",
  "priority": "high",
  "dueDate": "2024-01-15"
}
```

#### Update Task
```
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated task title",
  "status": "in-progress"
}
```

#### Delete Task
```
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

#### Get Task Statistics
```
GET /api/tasks/stats
Authorization: Bearer <token>
```

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests

### Code Structure

The application follows a clean architecture pattern:

- **Frontend**: Component-based architecture with React hooks and contexts
- **Backend**: MVC pattern with Express routes, Mongoose models, and middleware
- **Database**: MongoDB with proper indexing and validation
- **Real-time**: Socket.io for live updates across connected clients

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend Deployment (Heroku/Railway)
1. Set up MongoDB Atlas for production database
2. Configure environment variables
3. Deploy using the platform's CLI or dashboard

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=https://your-frontend-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing React framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB team for the powerful NoSQL database
- Express.js community for the robust web framework
- All contributors and open-source maintainers

## 📞 Support

If you have any questions or need help, please open an issue in the GitHub repository or contact the development team.

---

**Happy Task Managing! 🎉** # Task-Management-Web
