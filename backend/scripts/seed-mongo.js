require('dotenv').config();
const mongoose = require('mongoose');

// Define Schema Inline for the script (or import from models/mongo/AttendanceLog.js)
// [cite: 27-37]
const attendanceSchema = new mongoose.Schema({
  employeeId: { type: Number, required: true }, // References SQL ID
  shiftId: { type: Number, required: true },
  clockInTime: Date,
  clockOutTime: Date,
  location: {
    lat: Number,
    long: Number
  },
  anomalies: [String], // LATE_ARRIVAL, LOCATION_MISMATCH, etc.
  createdAt: { type: Date, default: Date.now }
});

const AttendanceLog = mongoose.model('AttendanceLog', attendanceSchema);

const seedMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔌 Connected to MongoDB...');

    // 1. Clear existing logs
    await AttendanceLog.deleteMany({});
    console.log('🗑️  Cleared existing logs.');

    // 2. Prepare Sample Data
    const today = new Date().toISOString().split('T')[0];

    const logs = [
      // Case 1: Perfect Attendance (No Anomalies)
      {
        employeeId: 2, // Bob Dev
        shiftId: 1,
        clockInTime: new Date(`${today}T08:55:00Z`), // 5 min early
        clockOutTime: new Date(`${today}T17:05:00Z`),
        location: { lat: 28.6139, long: 77.2090 }, // Valid location
        anomalies: []
      },
      // Case 2: Late Arrival [cite: 111]
      // Shift starts 09:00, Clock in 09:15
      {
        employeeId: 2,
        shiftId: 1, // Previous day shift logic assumed
        clockInTime: new Date(`${today}T09:15:00Z`), 
        clockOutTime: null, // Still active
        location: { lat: 28.6139, long: 77.2090 },
        anomalies: ['LATE_ARRIVAL']
      },
      // Case 3: Location Mismatch [cite: 113]
      // Clocking out from far away
      {
        employeeId: 3, // Charlie Support
        shiftId: 2,
        clockInTime: new Date(`${today}T12:00:00Z`),
        clockOutTime: new Date(`${today}T20:00:00Z`),
        location: { lat: 28.5000, long: 77.1000 }, // Far from expected
        anomalies: ['LOCATION_MISMATCH']
      }
    ];

    // 3. Insert Logs [cite: 75]
    await AttendanceLog.insertMany(logs);

    console.log(`✅ MongoDB Seeded with ${logs.length} logs!`);
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Mongo Seed Error:', err);
    mongoose.connection.close();
  }
};

seedMongo();