import { userRepository, transactionRepository } from "../repositories/index.js";

export const sendMoney = async ({ userId, amount, toAccount, description }) => {

    if (!toAccount) {
        throw new Error('Invalid input: Recipient email is required.');
    }

    if (!amount) {
        throw new Error('Invalid input: Amount is required.');
    }

    if (amount <= 0) {
        throw new Error('Invalid input: Amount must be positive.');
    }

    const fromEmail = await userRepository.getUserEmailById(userId);

    if (!fromEmail) {
        throw new Error('User not found.');
    }

    const debitSuccess = await userRepository.debitIfSufficient(fromEmail, amount);

    if (!debitSuccess) {
        throw new Error('Insufficient funds.');
    }

    try {

        const creditSuccess = await userRepository.incrementBalance(toAccount, amount);

        if (!creditSuccess) {
            throw new Error('Recipient account not found.');
        }

        const tx = await transactionRepository.createTransaction({
            fromEmail,
            toEmail: toAccount,
            amount,
            description,
            status: 'COMPLETED'
        });

        const newBalance = await userRepository.getBalanceByEmail(fromEmail);

        return {
            success: true,
            transactionId: tx.id,
            newBalance
        };

    } catch (err) {

        await userRepository.incrementBalance(fromEmail, amount);
        throw err;

    }
};