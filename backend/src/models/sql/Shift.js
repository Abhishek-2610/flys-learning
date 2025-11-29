const db = require('../../config/db-sql');

class ShiftModel {
  static async create({ team_id, start_time, end_time, required_roles }) {
    const text = `
      INSERT INTO shifts (team_id, start_time, end_time, required_roles)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [team_id, start_time, end_time, required_roles];
    const result = await db.query(text, values);
    return result.rows[0];
  }

  static async findById(id) {
    const text = `SELECT * FROM shifts WHERE id = $1`;
    const result = await db.query(text, [id]);
    return result.rows[0];
  }

  // Used for Team Schedule View [cite: 18]
  static async findByTeamId(teamId) {
    // Joins can be added here if we need to see who is assigned immediately
    const text = `
      SELECT s.*, 
      (SELECT COUNT(*) FROM assignments a WHERE a.shift_id = s.id) as assigned_count
      FROM shifts s
      WHERE s.team_id = $1
      ORDER BY s.start_time ASC
    `;
    const result = await db.query(text, [teamId]);
    return result.rows;
  }
}

module.exports = ShiftModel;