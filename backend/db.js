// db.js - Shared database connection pool
const { Pool } = require('pg');

// Create a single connection pool to be shared across the application
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/meta_funnel_db'
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
  process.exit(-1);
});

// Log successful connection
pool.on('connect', () => {
  console.log('Database connected successfully');
});

module.exports = pool;
