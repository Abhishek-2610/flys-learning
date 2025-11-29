const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  // Link to SQL Employee ID (Reference, but loose coupling)
  employeeId: { 
    type: Number, 
    required: true,
    index: true 
  },
  
  // Link to SQL Shift ID (Optional, as an employee might clock in unscheduled)
  shiftId: { 
    type: Number, 
    default: null 
  },
  
  clockInTime: { 
    type: Date, 
    required: true 
  },
  
  clockOutTime: { 
    type: Date, 
    default: null 
  },
  
  // Location Log [cite: 36]
  location: {
    lat: { type: Number, required: true },
    long: { type: Number, required: true }
  },
  
  // Anomalies Array [cite: 37]
  // e.g. ["LATE_ARRIVAL", "LOCATION_MISMATCH"]
  anomalies: {
    type: [String],
    default: []
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('AttendanceLog', attendanceSchema);