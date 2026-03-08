import { userRepository, transactionRepository } from "../repositories/index.js";

export async function getRecentTransactions(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User not found");

    return transactionRepository.getRecentTransactionsByUserEmail(user.email, { limit: 50 });
}

export async function getBalance(userId) {
    const balance = await userRepository.getBalanceByUserId(userId);
    if (balance === null || balance === undefined) {
        throw new Error("User not found");
    }
    return balance;
}
