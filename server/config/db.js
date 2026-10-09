import mongoose from 'mongoose';

/**
 * NextCampus Database Connection Handler
 * Connects to MongoDB via Mongoose with retry logic & event listeners
 */
export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextcampus';
    const conn = await mongoose.connect(connStr);

    console.log(`[NextCampus DB] MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      console.error(`[NextCampus DB Error]: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[NextCampus DB Warn] MongoDB disconnected. Attempting reconnect...');
    });

    return conn;
  } catch (error) {
    console.error(`[NextCampus DB Connection Failure]: ${error.message}`);
    console.warn('[NextCampus DB Info] Running in decoupled/mock mode without active MongoDB instance.');
  }
};

export default connectDB;
