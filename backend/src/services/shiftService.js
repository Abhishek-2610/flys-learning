const ShiftModel = require('../models/sql/Shift');
const AssignmentModel = require('../models/sql/Assignment');
const EmployeeModel = require('../models/sql/Employee');

// Create a new shift (Admin/Scheduler only)
const createNewShift = async (shiftData) => {
  return await ShiftModel.create(shiftData);
};

// Assign Employee to Shift (The "Graded" Logic)
const assignEmployeeToShift = async (shiftId, employeeId) => {
  
  // 1. Fetch Data
  const shift = await ShiftModel.findById(shiftId);
  const employee = await EmployeeModel.findById(employeeId);

  if (!shift || !employee) {
    throw new Error('Shift or Employee not found');
  }

  // --- RULE 1: TEAM CHECK [cite: 23] ---
  // "Employee may be assigned only to shifts belonging to their team."
  if (shift.team_id !== employee.team_id) {
    throw new Error(`Team mismatch: Employee belongs to team ${employee.team_id}, shift is for team ${shift.team_id}`);
  }

  // --- RULE 2: QUALIFICATION CHECK [cite: 21] ---
  // "Employee role must match one of shift.required_roles."
  // Note: shift.required_roles is an array of strings
  if (!shift.required_roles.includes(employee.role)) {
    throw new Error(`Qualification error: Shift requires [${shift.required_roles.join(', ')}], employee is '${employee.role}'`);
  }

  // --- RULE 3: CONFLICT CHECK [cite: 20] ---
  // "An employee cannot be assigned to overlapping shifts."
  const conflicts = await AssignmentModel.findOverlappingAssignments(
    employeeId, 
    shift.start_time, 
    shift.end_time
  );

  if (conflicts.length > 0) {
    const conflict = conflicts[0];
    throw new Error(`Schedule Conflict: Employee already assigned to shift ${conflict.id} (${conflict.start_time} - ${conflict.end_time})`);
  }

  // If all rules pass, create assignment
  return await AssignmentModel.create(shiftId, employeeId);
};

// Get Schedule for a specific team
const getTeamSchedule = async (teamId) => {
  // Get all shifts for the team
  const shifts = await ShiftModel.findByTeamId(teamId);
  
  // For each shift, get the assigned employees
  // (In a production app, this would be a single JOIN query, but loop is acceptable for this scale)
  const schedule = await Promise.all(shifts.map(async (shift) => {
    const assignments = await AssignmentModel.findByShiftId(shift.id);
    return {
      ...shift,
      assignments: assignments // includes employee name/role
    };
  }));

  return schedule;
};

module.exports = { createNewShift, assignEmployeeToShift, getTeamSchedule };