const db = require('../../config/db-sql');

class AssignmentModel {
  static async create(shiftId, employeeId) {
    const text = `
      INSERT INTO assignments (shift_id, employee_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await db.query(text, [shiftId, employeeId]);
    return result.rows[0];
  }

  // Find all assignments for a specific shift (to check capacity/who is working)
  static async findByShiftId(shiftId) {
    const text = `
      SELECT a.*, e.name, e.role 
      FROM assignments a
      JOIN employees e ON a.employee_id = e.id
      WHERE a.shift_id = $1
    `;
    const result = await db.query(text, [shiftId]);
    return result.rows;
  }

  // *** CONFLICT DETECTION QUERY *** [cite: 20]
  // Finds any EXISTING assignment for this employee that overlaps with the NEW start/end times.
  // Overlap Formula: (StartA < EndB) and (EndA > StartB)
  static async findOverlappingAssignments(employeeId, newStartTime, newEndTime) {
    const text = `
      SELECT a.id, s.start_time, s.end_time
      FROM assignments a
      JOIN shifts s ON a.shift_id = s.id
      WHERE a.employee_id = $1
      AND s.start_time < $3 
      AND s.end_time > $2
    `;
    // $1=empId, $2=newStart, $3=newEnd
    const result = await db.query(text, [employeeId, newStartTime, newEndTime]);
    return result.rows; // Returns array of conflicting assignments
  }
}

module.exports = AssignmentModel;