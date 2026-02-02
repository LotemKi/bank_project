import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import transactionRoutes from './routes/transaction.routes.js';

const app = express();

app.use(express.json());

// ---------- CORS middleware ----------
app.use(cors({
    origin: [
        process.env.FRONTEND_URL
    ],
}));
// --------------------------------------

app.use('/api/v1', authRoutes);
app.use('/api/v1/transactions', transactionRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

export default app;
