import User from "../db_models/user.model.js";
import Transactions from "../db_models/transaction.model.js";

export const sendMoney = async ({ userId, toAccount, amount, description }) => {
    if (!toAccount || !amount || amount <= 0) {
        throw new Error('Invalid input: Amount must be positive.');
    }

    const user = await User
        .findOne({ id: userId })
    const fromEmail = user.email;

    const debitResult = await User.updateOne(
        { email: fromEmail, balance: { $gte: amount } },
        { $inc: { balance: -amount } }
    );

    if (debitResult.modifiedCount !== 1) {
        throw new Error('Insufficient funds.');
    }

    try {
        // 2. Credit receiver
        const creditResult = await User.updateOne(
            { email: toAccount },
            { $inc: { balance: amount } }
        );

        if (creditResult.modifiedCount !== 1) throw new Error('Recipient account not found.');

        // 3. Record transaction
        const nextId = await getNextId('transactions');
        const tx = await Transactions.create({
            id: nextId, fromEmail, toEmail: toAccount, amount, description, status: 'COMPLETED'
        });

        return {
            success: true,
            transactionId: tx.id,
            newBalance: await User.findOne({ email: fromEmail }).then(u => u.balance)
        };
    } catch (err) {
        await User.updateOne({ email: fromEmail }, { $inc: { balance: amount } });
        throw err;
    }
};