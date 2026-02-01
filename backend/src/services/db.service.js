import mongoose from 'mongoose';

// Serverless-friendly connection caching for Mongoose
let cached = global._mongoCache;

if (!cached) {
  cached = global._mongoCache = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGODB_URI) {
    // No DB configured — throw an error so callers can handle it
    throw new Error('MONGODB_URI not set');
  }

  if (!cached.promise) {
    const opts = { autoIndex: true };
    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
