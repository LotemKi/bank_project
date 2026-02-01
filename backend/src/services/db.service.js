import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Skip if already connected (useful for serverless warm starts)
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: true
    });

    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    // Don't exit process in serverless environment - throw error instead
    throw err;
  }
};

export default connectDB;
