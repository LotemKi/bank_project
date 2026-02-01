import serverless from 'serverless-http';
import app from '../src/app.js';
import connectDB from '../src/services/db.service.js';

// Ensure DB connection at cold start (if MONGODB_URI is set in Vercel env)
// Top-level await is supported in ESM and helps initialize the DB for serverless invocations.
if (process.env.MONGODB_URI) {
    try {
        // connectDB may exit on failure in local code; handle errors gracefully in serverless.
        await connectDB();
    } catch (err) {
        console.error('DB connect failed at cold start:', err);
    }
}

// Export a serverless-compatible handler wrapping the Express app
export default serverless(app);
