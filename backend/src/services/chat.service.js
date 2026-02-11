import { getBalance, getRecentTransactions } from "./getdata.service.js";

export async function handleChatMessage({ userId, message }) {
    if (/balance/i.test(message)) {
        const balance = await getBalance(userId);
        return `Your current balance is ₪${balance}`;
    }

    if (/transaction|history/i.test(message)) {
        const [tx] = await getRecentTransactions(userId, 1);
        if (!tx) return "No transactions found.";
        return `Last transaction: ₪${tx.amount} for ${tx.description} at ${new Date(tx.createdAt).toLocaleString()}`;
    }

    return "Supported queries: balance, transactions, navigation.";
}
