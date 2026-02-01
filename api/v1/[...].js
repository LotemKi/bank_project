import 'dotenv/config';
import serverless from 'serverless-http';
import app from '../../backend/src/app.js';
import connectDB from '../../backend/src/services/db.service.js';

// Ensure DB connection at cold start (if MONGODB_URI is set in Vercel env)
if (process.env.MONGODB_URI) {
    try {
        await connectDB();
    } catch (err) {
        console.error('DB connect failed at cold start:', err);
    }
}

// Export a serverless-compatible handler wrapping the Express app
export default serverless(app);

