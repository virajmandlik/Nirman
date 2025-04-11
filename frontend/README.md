# Nirman Learning Platform

Nirman is an adaptive learning platform designed to provide personalized educational experiences. The platform features authentication, personalized content, gamified learning, an interactive coding environment, and a multilingual assistant.

## Features

- User Authentication (Register/Login)
- Personalized Content Dashboard
- Gamified Learning Experience
- Interactive Coding Environment
- Multilingual LLM Assistant

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Shadcn UI components
- Framer Motion for animations
- TanStack Query for data fetching

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Mongoose for database modeling

## Project Structure

```
nirman/
├── backend/           # Node.js backend
│   ├── src/
│   │   ├── config/    # Configuration files
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Custom middleware
│   │   ├── models/    # Database models
│   │   ├── routes/    # API routes
│   │   └── index.js   # Entry point
│   ├── .env           # Environment variables
│   └── package.json   # Dependencies
└── src/               # React frontend
    ├── components/    # Reusable components
    ├── contexts/      # React contexts
    ├── hooks/         # Custom hooks
    ├── lib/           # Utility functions
    ├── pages/         # Page components
    └── App.tsx        # Main application component
```

## Setup Instructions

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (local or Atlas)

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/nirman
   JWT_SECRET=your-secret-key
   JWT_EXPIRE=30d
   ```

4. Start the backend server:
   ```
   npm run backend
   ```
   or
   ```
   npm run dev
   ```

### Frontend Setup
1. In the project root directory, install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run frontend
   ```
   or
   ```
   npm run dev
   ```

## Running the Application

### Option 1: Using Startup Scripts

We've included convenience scripts to start both the frontend and backend servers simultaneously.

#### For Windows:
Simply double-click the `start-servers.bat` file or run:
```
start-servers.bat
```

#### For Mac/Linux:
Make the script executable and run it:
```bash
chmod +x start-servers.sh
./start-servers.sh
```

### Option 2: Manual Startup

You need to run both the frontend and backend in separate terminal windows:

#### Terminal 1 (Backend):
```
cd backend
npm run dev
```

#### Terminal 2 (Frontend):
```
npm run frontend
```

The frontend will be available at http://localhost:5173 and the backend at http://localhost:5000.

## API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user
- `GET /api/auth/me` - Get current user (requires authentication)

### User Routes
- `PUT /api/users/profile` - Update user profile (requires authentication)
- `PUT /api/users/preferences` - Update user preferences (requires authentication)
- `PUT /api/users/progress` - Update user progress (requires authentication)

## Authentication Flow

1. User registers or logs in
2. Backend validates credentials and returns a JWT token
3. Frontend stores the token in localStorage
4. The token is included in the Authorization header for protected routes
5. Protected routes check for valid token before granting access

## License

MIT 
