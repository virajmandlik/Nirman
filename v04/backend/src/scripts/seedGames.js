require('dotenv').config();
const seedDatabase = require('../seeds/gameSeed');

console.log('Starting to seed games database...');
seedDatabase()
  .then(() => {
    console.log('Games database seeding completed successfully!');
  })
  .catch((error) => {
    console.error('Error seeding games database:', error);
    process.exit(1);
  }); 