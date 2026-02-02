import mongoose from 'mongoose';

/**
 * Connect to MongoDB. Idempotent: safe to call multiple times (e.g. in serverless).
 * Reuses existing connection when mongoose.connection.readyState === 1.
 * Does NOT call process.exit() so it's safe for Vercel serverless.
 */
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set');
  }
  await mongoose.connect(process.env.MONGODB_URI, {
    autoIndex: true,
  });
  console.log('MongoDB connected');
};

export default connectDB;
