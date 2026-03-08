import pool from '../../db/postgres.js';

const mapUserRow = (row) => {
    if (!row) return null;

    return {
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        password: row.password,
        phone: row.phone,
        verificationStatus: row.verification_status,
        balance: row.balance,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
};

const findByEmail = async (email) => {
    const { rows } = await pool.query(
        'SELECT id, first_name, last_name, email, phone, verification_status, balance, created_at, updated_at FROM users WHERE email = $1',
        [email]
    );
    return mapUserRow(rows[0]);
};

const findByEmailWithPassword = async (email) => {
    const { rows } = await pool.query(
        'SELECT id, first_name, last_name, email, password, phone, verification_status, balance, created_at, updated_at FROM users WHERE email = $1',
        [email]
    );
    return mapUserRow(rows[0]);
};

const createUser = async (data) => {
    const {
        id,
        firstName,
        lastName,
        email,
        password,
        phone,
        verificationStatus,
        balance
    } = data;

    const { rows } = await pool.query(
        `INSERT INTO users
       (id, first_name, last_name, email, password, phone, verification_status, balance)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, first_name, last_name, email, phone, verification_status, balance, created_at, updated_at`,
        [id, firstName, lastName, email, password, phone, verificationStatus, balance]
    );

    return mapUserRow(rows[0]);
};

const deleteById = async (id) => {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
};

const findById = async (id) => {
    const { rows } = await pool.query(
        'SELECT id, first_name, last_name, email, phone, verification_status, balance, created_at, updated_at FROM users WHERE id = $1',
        [id]
    );
    return mapUserRow(rows[0]);
};

const updateVerificationStatus = async (id, status) => {
    await pool.query(
        'UPDATE users SET verification_status = $2 WHERE id = $1',
        [id, status]
    );
};

const debitIfSufficient = async (email, amount) => {
    const { rowCount } = await pool.query(
        'UPDATE users SET balance = balance - $2 WHERE email = $1 AND balance >= $2',
        [email, amount]
    );
    return rowCount === 1;
};

const incrementBalance = async (email, amount) => {
    const { rowCount } = await pool.query(
        'UPDATE users SET balance = balance + $2 WHERE email = $1',
        [email, amount]
    );
    return rowCount === 1;
};

const getBalanceByUserId = async (id) => {
    const { rows } = await pool.query(
        'SELECT balance FROM users WHERE id = $1',
        [id]
    );
    return rows[0]?.balance ?? null;
};

const getBalanceByEmail = async (email) => {
    const { rows } = await pool.query(
        'SELECT balance FROM users WHERE email = $1',
        [email]
    );
    return rows[0]?.balance ?? null;
};

const getUserEmailById = async (id) => {
    const { rows } = await pool.query(
        'SELECT email FROM users WHERE id = $1',
        [id]
    );
    return rows[0]?.email ?? null;
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

