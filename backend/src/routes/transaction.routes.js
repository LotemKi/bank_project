import express from 'express';
import { getTransactions, createTransaction, getTransactionById } from '../controller/transaction.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, getTransactions);
router.post('/', authMiddleware, createTransaction);
router.get('/:transactionId', authMiddleware, getTransactionById);

export default router;
