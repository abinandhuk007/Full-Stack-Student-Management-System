const { Pool } = require('pg');

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres',       // Update with your PostgreSQL username
  host: 'localhost',
  database: 'student_management_db',
  password: '1234',      // Update with your PostgreSQL password
  port: 5432,
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');
  release();
});

module.exports = pool;
