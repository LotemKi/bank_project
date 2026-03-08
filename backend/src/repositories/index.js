import mongoUserRepository from './mongo/user.repository.js';
import mongoTransactionRepository from './mongo/transaction.repository.js';
import postgresUserRepository from './postgres/user.repository.js';
import postgresTransactionRepository from './postgres/transaction.repository.js';

const dbType = (process.env.DB_TYPE || 'mongo').toLowerCase();

let userRepository;
let transactionRepository;

if (dbType === 'postgres') {
    userRepository = postgresUserRepository;
    transactionRepository = postgresTransactionRepository;
} else {
    userRepository = mongoUserRepository;
    transactionRepository = mongoTransactionRepository;
}

export { userRepository, transactionRepository };

export default {
    userRepository,
    transactionRepository
};

