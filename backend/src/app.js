import express from 'express';
import authRoutes from './routes/auth.routes.js';
import transactionRoutes from './routes/transaction.routes.js';

const app = express();
app.use(express.json());

app.use('/api/v1', authRoutes);
app.use('/api/v1/transactions', transactionRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

export default app;
