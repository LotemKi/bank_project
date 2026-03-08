import Transactions from '../../db_models/transaction.model.js';
import { getNextId } from '../../services/counter.service.js';

const getByUserEmail = async (email, { offset = 0, limit = 500 } = {}) => {
    const [transactions, total] = await Promise.all([
        Transactions.find({
            $or: [{ fromEmail: email }, { toEmail: email }]
        })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .lean(),
        Transactions.countDocuments({
            $or: [{ fromEmail: email }, { toEmail: email }]
        })
    ]);

    return { transactions, total };
};

const createTransaction = async ({ fromEmail, toEmail, amount, description, status }) => {
    const nextId = await getNextId('transactions');

    const tx = await Transactions.create({
        id: nextId,
        fromEmail,
        toEmail,
        amount,
        description,
        status
    });

    return tx.toObject();
};

const findById = async (transactionId) => {
    return Transactions.findOne({ id: transactionId }).lean();
};

const getRecentTransactionsByUserEmail = async (email, { limit = 50 } = {}) => {
    return Transactions.find({
        $or: [{ fromEmail: email }, { toEmail: email }]
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('amount fromEmail toEmail status description createdAt')
        .lean();
};

export {
    getByUserEmail,
    createTransaction,
    findById,
    getRecentTransactionsByUserEmail
};

export default {
    getByUserEmail,
    createTransaction,
    findById,
    getRecentTransactionsByUserEmail
};

