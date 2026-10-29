import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_mystery_room';

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    console.log(`[Database] MongoDB connected successfully to ${uri}`);
  } catch (error) {
    console.warn(`[Database] Warning: Could not connect to MongoDB at ${uri}: ${error.message}`);
    console.warn(`[Database] Running with in-memory persistence fallback for seamless local operation.`);
    isConnected = false;
  }
};

export const getIsConnected = () => isConnected;
