import User from '../../db_models/user.model.js';

const normalize = (doc) => {
    if (!doc) return null;
    return typeof doc.toObject === 'function' ? doc.toObject() : doc;
};

const findByEmail = async (email) => {
    const user = await User.findOne({ email });
    return normalize(user);
};

const findByEmailWithPassword = async (email) => {
    const user = await User.findOne({ email }).select('+password');
    return normalize(user);
};

const createUser = async (data) => {
    const user = await User.create(data);
    return normalize(user);
};

const deleteById = async (id) => {
    return User.deleteOne({ id });
};

const findById = async (id) => {
    const user = await User.findOne({ id });
    return normalize(user);
};

const updateVerificationStatus = async (id, status) => {
    return User.updateOne({ id }, { verificationStatus: status });
};

const debitIfSufficient = async (email, amount) => {
    const result = await User.updateOne(
        { email, balance: { $gte: amount } },
        { $inc: { balance: -amount } }
    );

    return result?.modifiedCount === 1;
};

const incrementBalance = async (email, amount) => {
    const result = await User.updateOne(
        { email },
        { $inc: { balance: amount } }
    );

    return result?.modifiedCount === 1;
};

const getBalanceByUserId = async (id) => {
    const user = await User.findOne({ id }).select('balance');
    return user ? user.balance : null;
};

const getBalanceByEmail = async (email) => {
    const user = await User.findOne({ email }).select('balance');
    return user ? user.balance : null;
};

const getUserEmailById = async (id) => {
    const user = await User.findOne({ id }).select('email');
    return user ? user.email : null;
};

export {
    findByEmail,
    findByEmailWithPassword,
    createUser,
    deleteById,
    findById,
    updateVerificationStatus,
    debitIfSufficient,
    incrementBalance,
    getBalanceByUserId,
    getBalanceByEmail,
    getUserEmailById
};

export default {
    findByEmail,
    findByEmailWithPassword,
    createUser,
    deleteById,
    findById,
    updateVerificationStatus,
    debitIfSufficient,
    incrementBalance,
    getBalanceByUserId,
    getBalanceByEmail,
    getUserEmailById
};