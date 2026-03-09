import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool(
  process.env.POSTGRESQL_URI
    ? { connectionString: process.env.POSTGRESQL_URI, ssl: { rejectUnauthorized: false } }
    : {
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT) || 5432,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }
);

pool.on('connect', () => console.log('PostgreSQL connected'));
pool.on('error', (err) => {
  console.error('PostgreSQL connection error', err);
  process.exit(1);
});

export default pool;

