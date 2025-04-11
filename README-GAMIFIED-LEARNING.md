# Gamified Learning Module

A Quiz-based learning module with achievements, badges, and leaderboards for educational content mastery.

## Features

- **Interactive Quizzes:** Quizzes across various programming categories with multiple difficulty levels
- **Game Sessions:** Timed quiz sessions with scoring based on difficulty and time taken
- **Achievements System:** Unlock achievements based on performance and participation
- **Leaderboards:** Compete with other users for top scores on each quiz
- **Progress Tracking:** Visual representation of learning progress
- **Difficulty Progression:** Graduated difficulty levels to match learning progress

## Quick Start

1. Ensure your MongoDB database is running
2. Run the seed script to populate the database with initial game data:

```bash
# From the backend directory
npm run seed:all
```

## Technology Stack

- **Frontend:** React with TypeScript
- **Backend:** Node.js with Express
- **Database:** MongoDB with Mongoose
- **State Management:** React Context API
- **Styling:** Tailwind CSS with shadcn/ui components
- **Animations:** Framer Motion

## Module Structure

### Backend Components

- **Models:**
  - Game: Defines quiz structure and questions
  - GameSession: Tracks active game sessions
  - User: Extended with game history and achievements

- **Controllers:**
  - gameController: Handles game-related API endpoints
  
- **Routes:**
  - gameRoutes: Defines API routes for game operations

- **Seeds:**
  - gameSeed: Populates database with initial quiz data and achievements

### Frontend Components

- **Contexts:**
  - GameContext: Manages game state and API communication

- **Pages:**
  - GamifiedLearning: Main game dashboard with category selection
  - Game: Interactive quiz gameplay interface
  - Achievements: Display of earned and locked achievements
  - Leaderboard: Ranking of top players for each quiz

## API Endpoints

### Game Management
- `GET /api/games` - Get all published games
- `GET /api/games/category/:category` - Get games by category
- `GET /api/games/:id` - Get specific game by ID
- `POST /api/games` - Create a new game (admin only)

### Game Sessions
- `POST /api/games/:id/start` - Start a new game session
- `POST /api/sessions/:sessionId/submit` - Submit an answer
- `POST /api/sessions/:sessionId/end` - End a game session

### User Progress
- `GET /api/user/progress` - Get user's game progress
- `GET /api/user/achievements` - Get user's achievements
- `GET /api/user/history` - Get user's game history
- `GET /api/games/:id/leaderboard` - Get leaderboard for a game

## Achievement System

Achievements are awarded based on:
- Completing games
- Reaching score thresholds
- Maintaining high accuracy
- Completing category mastery
- Consistent participation
- Streak achievements

## Score Calculation

Scores are calculated based on:
- Question difficulty
- Time taken to answer
- Consecutive correct answers
- Completion bonuses

## Future Enhancements

- Real-time multiplayer quizzes
- Challenge modes with limited lives
- Daily/weekly challenges
- Achievement sharing on social media
- Custom quiz creation for users
- Advanced analytics on learning progress

## Contribution

When adding new features to the Gamified Learning module:

1. Ensure new games follow the established schema
2. Update achievement conditions as needed
3. Follow established design patterns for consistency
4. Add proper documentation for API endpoints
5. Use TypeScript types for all new components 