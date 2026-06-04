import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log('Connected to MongoDB');
  } catch (e) {
    if (e instanceof Error) {
      console.log('Failed to connect to MongoDB', e.message);
      process.exit(1);
    }
  }
}

export default mongoose;