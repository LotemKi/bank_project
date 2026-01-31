import Transactions from '../db_models/transaction.model.js';
import User from '../db_models/user.model.js';
import { getNextId } from '../services/counter.service.js';

/* ========================= GET ALL TRANSACTIONS ========================= */

export const getTransactions = async (req, res) => {
  const userEmail = req.user.email;
  const offset = Number(req.query.offset) || 0;
  const limit = Number(req.query.limit) || 500;

  // Find transactions involving this user
  const [transactions, total] = await Promise.all([
    Transactions.find({
      $or: [{ fromEmail: userEmail }, { toEmail: userEmail }]
    })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean(),
    Transactions.countDocuments({
      $or: [{ fromEmail: userEmail }, { toEmail: userEmail }]
    })
  ]);

  res.json({
    success: true,
    data: {
      transactions: transactions,
      total,
      offset,
      limit
    }
  });
};

/* ========================= CREATE ========================= */

export const createTransaction = async (req, res) => {
  const fromEmail = req.user.email;
  const { toAccount, amount, description } = req.body;

  if (!toAccount || !amount || amount <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid input' });
  }

  // 1. Debit sender atomically
  const debitResult = await User.updateOne(
    { email: fromEmail, balance: { $gte: amount } },
    { $inc: { balance: -amount } } // <- negative for sender
  );

  if (debitResult.modifiedCount !== 1) {
    return res.status(400).json({ success: false, error: 'Insufficient funds' });
  }

  try {
    // 2. Credit receiver
    const creditResult = await User.updateOne(
      { email: toAccount },
      { $inc: { balance: amount } }
    );

    if (creditResult.modifiedCount !== 1) {
      throw new Error('Receiver not found');
    }

    // 3. Create transaction record
    const nextId = await getNextId('transactions');

    const tx = await Transactions.create({
      id: nextId,
      fromEmail,
      toEmail: toAccount,
      amount: amount, // always positive in record
      description,
      status: 'COMPLETED'
    });

    return res.status(201).json({
      success: true,
      data: {
        transactionId: tx.id,
        amount: tx.amount,
        recipientAccount: toAccount,
        timestamp: tx.createdAt
      }
    });

  } catch (err) {
    // Rollback sender balance if credit or record creation fails
    await User.updateOne(
      { email: fromEmail },
      { $inc: { balance: amount } }
    );

    return res.status(500).json({
      success: false,
      error: 'Transaction failed and was rolled back'
    });
  }
};

/* ========================= GET BY ID ========================= */

export const getTransactionById = async (req, res) => {
  const { transactionId } = req.params;
  const userEmail = req.user.email;

  // Find the transaction
  const transaction_found = await Transactions.findOne({ id: transactionId }).lean();

  if (!transaction_found) {
    return res.status(404).json({
      success: false,
      error: 'Transaction not found'
    });
  }

  // Optional: ensure the user is involved in this transaction
  if (transaction_found.fromEmail !== userEmail && transaction_found.toEmail !== userEmail) {
    return res.status(403).json({
      success: false,
      error: 'Access denied'
    });
  }

  res.json({
    success: true,
    data: transaction_found
  });
};
