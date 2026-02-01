import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: true
    });

    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed');
    process.exit(1);
  }
};

export default connectDB;
