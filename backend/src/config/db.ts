import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async (): Promise<typeof mongoose> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log('[DB] MongoDB Atlas connected successfully');
    return conn;
  } catch (error) {
    console.error(`[DB] Error connecting to MongoDB: ${(error as Error).message}`);
    return mongoose;
  }
};
