import dotenv from 'dotenv';
import mongoose from 'mongoose';
import seedData from '../utils/seedData';

// Load environment variables
dotenv.config();

const runSeed = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aiml_department';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Run seed data
    await seedData();

    // Close connection
    await mongoose.connection.close();
    console.log('📦 MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();
