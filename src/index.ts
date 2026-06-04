import app from './app';
import { connectDB } from './config/database';
import dotenv from 'dotenv';
dotenv.config();

const startServer = async ():Promise<void> => {
  try {
    await connectDB();
    app.listen(process.env.PORT ?? 8086, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT ?? 8086}/api`)
    });
  } catch (error: any) {
    console.error('Failed to start server: ', error);
    throw error;
  }
};

startServer();  