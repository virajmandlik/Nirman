# Nirman Learning Platform - Quick Start Guide

This guide will help you get the Nirman Learning Platform up and running quickly on your machine.

## Prerequisites

Before you begin, make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd nirman
```

## Step 2: Install Dependencies

Install dependencies for both the frontend and backend:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

## Step 3: Configure MongoDB

Make sure MongoDB is running. For a local MongoDB installation:

```bash
# Start MongoDB locally
mongod
```

Or configure the connection string in `backend/.env` to point to your MongoDB Atlas cluster.

## Step 4: Set Up Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/nirman
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=30d
```

Replace `your-secret-key-here` with a strong secret key for JWT token encryption.

## Step 5: Start the Application

### Option 1: Using Startup Scripts

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

#### Start the Backend (Terminal 1)

```bash
cd backend
npm run dev
```

#### Start the Frontend (Terminal 2)

```bash
npm run frontend
```

This will:
- Start the backend server at http://localhost:5000
- Start the frontend development server at http://localhost:5173

## Step 6: Access the Application

Open your browser and navigate to:

http://localhost:5173

## Available Commands

### Frontend Commands (run from project root)
- `npm run frontend` - Starts the frontend development server
- `npm run dev` - Alias for `npm run frontend`
- `npm run build` - Builds the frontend for production

### Backend Commands (run from backend directory)
- `npm run backend` - Starts the backend with nodemon (auto-reload)
- `npm run dev` - Alias for `npm run backend`
- `npm start` - Starts the backend without auto-reload

## Initial Login

Register a new account through the application interface, or use these default credentials if they've been set up:

```
Email: admin@nirman.com
Password: password123
```

## Troubleshooting

### Backend Connection Issues
- Ensure MongoDB is running
- Check that the MONGO_URI in your .env file is correct
- Verify the backend is running at http://localhost:5000

### Frontend Connection Issues
- Check that the API URLs in the frontend code are pointing to http://localhost:5000
- Ensure all dependencies are installed properly
- Clear browser cache and localStorage

For more detailed information, refer to the full [README.md](./README.md). 