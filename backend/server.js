require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectSQL } = require('./src/config/db-sql'); // You will create this in config
const { connectMongo } = require('./src/config/db-mongo'); // You will create this in config

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const shiftRoutes = require('./src/routes/shiftRoutes');
const teamRoutes = require('./src/routes/teamRoutes'); // [cite: 65]
const attendanceRoutes = require('./src/routes/attendanceRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON bodies

// Database Connections
// We initialize these here to ensure DBs are ready before accepting traffic
const startServer = async () => {
  try {
    await connectSQL();  // Connect to PostgreSQL
    await connectMongo(); // Connect to MongoDB
    console.log('✅ All Databases connected successfully');

    // Mount Routes [cite: 59-68]
    app.use('/api/auth', authRoutes);
    app.use('/api/shifts', shiftRoutes);
    app.use('/api/teams', teamRoutes);
    app.use('/api/attendance', attendanceRoutes);

    // Global Error Handler
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Internal Server Error', message: err.message });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();