import pool from '../../services/postgresdb.service.js';

const mapTransactionRow = (row) => {
    if (!row) return null;

    return {
        id: row.id,
        fromEmail: row.from_email,
        toEmail: row.to_email,
        amount: row.amount,
        status: row.status,
        description: row.description,
        createdAt: row.created_at
    };
};

const getByUserEmail = async (email, { offset = 0, limit = 500 } = {}) => {
    const [listResult, countResult] = await Promise.all([
        pool.query(
            `SELECT id, from_email, to_email, amount, status, description, created_at
       FROM transactions
       WHERE from_email = $1 OR to_email = $1
       ORDER BY created_at DESC
       OFFSET $2 LIMIT $3`,
            [email, offset, limit]
        ),
        pool.query(
            `SELECT COUNT(*) AS total
       FROM transactions
       WHERE from_email = $1 OR to_email = $1`,
            [email]
        )
    ]);

    const transactions = listResult.rows.map(mapTransactionRow);
    const total = Number(countResult.rows[0]?.total ?? 0);

    return { transactions, total };
};

const createTransaction = async ({ fromEmail, toEmail, amount, description, status }) => {
    const { rows } = await pool.query(
        `INSERT INTO transactions
       (from_email, to_email, amount, status, description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, from_email, to_email, amount, status, description, created_at`,
        [fromEmail, toEmail, amount, status, description]
    );

    return mapTransactionRow(rows[0]);
};

const findById = async (transactionId) => {
    const { rows } = await pool.query(
        `SELECT id, from_email, to_email, amount, status, description, created_at
     FROM transactions
     WHERE id = $1`,
        [transactionId]
    );

    return mapTransactionRow(rows[0]);
};

const getRecentTransactionsByUserEmail = async (email, { limit = 50 } = {}) => {
    const { rows } = await pool.query(
        `SELECT id, from_email, to_email, amount, status, description, created_at
     FROM transactions
     WHERE from_email = $1 OR to_email = $1
     ORDER BY created_at DESC
     LIMIT $2`,
        [email, limit]
    );

    return rows.map(mapTransactionRow);
};

export default {
    getByUserEmail,
    createTransaction,
    findById,
    getRecentTransactionsByUserEmail
};

