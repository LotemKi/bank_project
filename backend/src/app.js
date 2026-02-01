import express from 'express';
import authRoutes from './routes/auth.routes.js';
import transactionRoutes from './routes/transaction.routes.js';

const app = express();
app.use(express.json());

// Simple request logger to help debugging on Vercel (prints to function logs)
app.use((req, res, next) => {
	console.log(`[api] ${req.method} ${req.originalUrl}`);
	next();
});

app.use('/api/v1', authRoutes);
app.use('/api/v1/transactions', transactionRoutes);

// Health check for serverless/runtime verification
app.get('/api/v1/health', (req, res) => {
	res.json({ ok: true, timestamp: Date.now() });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

export default app;
