/**
 * Vercel serverless entry: runs Express app with DB connection.
 * All /api/* requests are rewritten here (vercel.json). Path is passed as ?path= and restored below.
 * Vercel injects env vars at runtime; dotenv is for local `vercel dev`.
 */
import 'dotenv/config';
import app from '../backend/src/app.js';
import connectDB from '../backend/src/services/db.service.js';

export default async function handler(req, res) {
  // Restore path: rewrite sends /api?path=v1/auth/login — Express needs req.url = /api/v1/auth/login
  const path = (req.query && req.query.path) || '';
  const pathStr = Array.isArray(path) ? path.join('/') : String(path);
  req.url = pathStr ? `/api/${pathStr}` : '/api';

  try {
    await connectDB();
  } catch (err) {
    console.error('MongoDB connection failed', err.message || err);
    const isEnv = err.message && err.message.includes('MONGODB_URI');
    return res.status(503).json({
      error: 'Database unavailable',
      hint: isEnv ? 'Set MONGODB_URI in Vercel Project Settings → Environment Variables' : undefined,
    });
  }
  app(req, res);
}
