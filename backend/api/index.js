import serverless from 'serverless-http';
import app from '../src/app.js';
import connectDB from '../src/services/db.service.js';

// Ensure DB connection at cold start (top-level await supported in ESM)
await connectDB();

// Export a serverless-compatible handler wrapping the Express app
export default serverless(app);
