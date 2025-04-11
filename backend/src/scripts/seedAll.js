require('dotenv').config();
const seedGames = require('../seeds/gameSeed');
const mongoose = require('mongoose');

// Run all seed operations
async function seedAll() {
  try {
    console.log('🌱 Starting database seeding process...');
    
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
    
    // Seed games and achievements
    console.log('🎮 Seeding games and achievements...');
    await seedGames();
    
    // Add any other seed operations here
    // e.g., await seedUsers();
    
    console.log('✅ All seed operations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding process:', error);
    process.exit(1);
  }
}

// Run the seed function
seedAll(); 