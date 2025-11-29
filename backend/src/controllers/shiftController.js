const shiftService = require('../services/shiftService');

// Create a new Shift
const createShift = async (req, res, next) => {
  try {
    // Body: team_id, start_time, end_time, required_roles
    const shiftData = req.body; 
    const newShift = await shiftService.createNewShift(shiftData);
    
    res.status(201).json({
      message: 'Shift created successfully',
      data: newShift
    });
  } catch (error) {
    next(error);
  }
};

// Assign Employee to Shift
// This endpoint triggers the 3 Assignment Rules (Conflict, Qual, Team)
const assignShift = async (req, res, next) => {
  try {
    const { shiftId } = req.params;
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: 'employeeId is required' });
    }

    const assignment = await shiftService.assignEmployeeToShift(shiftId, employeeId);

    res.status(200).json({
      message: 'Employee assigned successfully',
      data: assignment
    });
  } catch (error) {
    // Handle specific business rule violations [cite: 85, 86]
    if (error.message.includes('Conflict') || 
        error.message.includes('Qualification') || 
        error.message.includes('Team mismatch')) {
      return res.status(409).json({ error: 'Assignment Failed', reason: error.message });
    }
    next(error);
  }
};

module.exports = { createShift, assignShift };