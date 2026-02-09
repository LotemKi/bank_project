import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

export async function getRecentTransactions(userEmail, limit = 5) {
    return Transaction.find({
        $or: [
            { fromEmail: userEmail },
            { toEmail: userEmail }
        ]
    })
        .sort({ createdAt: -1 })
        .limit(limit)
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
