require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcryptjs'); // [cite: 54]

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const seedSQL = async () => {
  try {
    await client.connect();
    console.log('🔌 Connected to SQL Database...');

    // 1. Cleanup (Drop tables to start fresh)
    // Order matters due to Foreign Keys
    await client.query(`DROP TABLE IF EXISTS assignments CASCADE`);
    await client.query(`DROP TABLE IF EXISTS shifts CASCADE`);
    await client.query(`DROP TABLE IF EXISTS employees CASCADE`);
    await client.query(`DROP TABLE IF EXISTS teams CASCADE`);

    // 2. Create Schema (DDL) [cite: 14, 15]
    
    // TEAMS
    await client.query(`
      CREATE TABLE teams (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL
      );
    `);

    // EMPLOYEES [cite: 15]
    await client.query(`
      CREATE TABLE employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'employee', -- 'admin', 'scheduler', 'employee' [cite: 58]
        team_id INTEGER REFERENCES teams(id)
      );
    `);

    // SHIFTS [cite: 15, 16]
    // Note: storing required_roles as a JSONB array or Text array
    await client.query(`
      CREATE TABLE shifts (
        id SERIAL PRIMARY KEY,
        team_id INTEGER REFERENCES teams(id),
        start_time TIMESTAMPTZ NOT NULL, -- ISO support
        end_time TIMESTAMPTZ NOT NULL,
        required_roles TEXT[] -- Array of strings e.g. ['nurse', 'doctor']
      );
    `);

    // ASSIGNMENTS [cite: 17]
    await client.query(`
      CREATE TABLE assignments (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES employees(id),
        shift_id INTEGER REFERENCES shifts(id),
        UNIQUE(employee_id, shift_id) -- Prevent double assignment
      );
    `);

    // 3. Insert Data
    console.log('🌱 Seeding Data...');

    // Teams
    const teamsRes = await client.query(`
      INSERT INTO teams (name) VALUES ('Engineering'), ('Support') RETURNING id, name;
    `);
    const engTeam = teamsRes.rows[0];
    const suppTeam = teamsRes.rows[1];

    // Employees (Hash passwords) [cite: 54]
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await client.query(`
      INSERT INTO employees (name, email, password, role, team_id) VALUES
      ('Alice Admin', 'alice@flys.com', $1, 'admin', $2),
      ('Bob Dev', 'bob@flys.com', $1, 'employee', $2),
      ('Charlie Support', 'charlie@flys.com', $1, 'employee', $3)
    `, [hashedPassword, engTeam.id, suppTeam.id]);

    // Shifts [cite: 105] (Creating a shift for today 09:00 - 17:00)
    // Using simple ISO strings for clarity
    const today = new Date().toISOString().split('T')[0];
    
    await client.query(`
      INSERT INTO shifts (team_id, start_time, end_time, required_roles) VALUES
      ($1, '${today}T09:00:00Z', '${today}T17:00:00Z', ARRAY['employee', 'admin']),
      ($2, '${today}T12:00:00Z', '${today}T20:00:00Z', ARRAY['employee'])
    `, [engTeam.id, suppTeam.id]);

    console.log('✅ SQL Seeding Complete!');
    await client.end();
  } catch (err) {
    console.error('❌ SQL Seed Error:', err);
    await client.end();
  }
};

seedSQL();