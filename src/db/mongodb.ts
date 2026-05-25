'use server';
import './dns';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI!;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(uri, {
      dbName: 'Morphify',
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
};

export default connectDB;
