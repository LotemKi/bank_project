import Transaction from "../db_models/transaction.model.js";
import User from "../db_models/user.model.js";

export async function getRecentTransactions(userId) {
    const user = await User
        .findOne({ id: userId })
    return Transaction.find({
        $or: [
            { fromEmail: user.email },
            { toEmail: user.email }
        ]
    })
        .sort({ createdAt: -1 })
        .select("amount fromEmail toEmail status description createdAt");
}

export async function getBalance(userId) {
    const user = await User
        .findOne({ id: userId })
        .select("balance");

    if (!user) {
        throw new Error("User not found");
    }

    return user.balance;
}
