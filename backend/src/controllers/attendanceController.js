const attendanceService = require('../services/attendanceService');

// Clock In
const clockIn = async (req, res, next) => {
  try {
    const { employeeId, shiftId, location } = req.body;
    
    const log = await attendanceService.recordClockIn(employeeId, shiftId, location);
    
    res.status(201).json({
      message: 'Clock-in recorded',
      data: log
    });
  } catch (error) {
    next(error);
  }
};

// Clock Out
// Triggers Anomaly Detection (Late, Early, Location) [cite: 39]
const clockOut = async (req, res, next) => {
  try {
    const { employeeId, location } = req.body; // shiftId usually inferred from active log
    
    const result = await attendanceService.recordClockOut(employeeId, location);
    
    res.status(200).json({
      message: 'Clock-out recorded',
      anomalies_detected: result.anomalies.length > 0,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Get Attendance Logs (with filters)
const getAttendanceLogs = async (req, res, next) => {
  try {
    const { employeeId, teamId, date } = req.query;
    
    const logs = await attendanceService.getLogs({ employeeId, teamId, date });
    
    res.status(200).json({ count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};

module.exports = { clockIn, clockOut, getAttendanceLogs };