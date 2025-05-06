import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', process.env.MONGODB_URL);
    
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log('MongoDB connected successfully!');
    
    await mongoose.connection.close();
    console.log('Connection closed.');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

testConnection(); 