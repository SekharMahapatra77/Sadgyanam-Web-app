import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async (): Promise<typeof mongoose> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[DB] Error connecting to MongoDB: ${(error as Error).message}`);
    // Non-fatal fallback for local testing if MongoDB daemon is inactive
    return mongoose;
  }
};
