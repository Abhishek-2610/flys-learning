const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool
// This manages multiple connections for concurrent requests
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Function to test the connection on startup
const connectSQL = async () => {
  try {
    const client = await pool.connect();
    console.log(`✅ Connected to SQL Database (PostgreSQL) at ${process.env.DB_HOST}`);
    client.release(); // Release the client back to the pool immediately
  } catch (err) {
    console.error('❌ SQL Connection Failed:', err.message);
    process.exit(1); // Exit process if DB is essential
  }
};

// Export the query method directly for easier use in models/controllers
module.exports = {
  pool,
  connectSQL,
  query: (text, params) => pool.query(text, params),
};