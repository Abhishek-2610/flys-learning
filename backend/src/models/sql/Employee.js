const db = require('../../config/db-sql');

class EmployeeModel {
  static async findByEmail(email) {
    const text = `SELECT * FROM employees WHERE email = $1`;
    const result = await db.query(text, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const text = `SELECT * FROM employees WHERE id = $1`;
    const result = await db.query(text, [id]);
    return result.rows[0];
  }

  static async create({ name, email, password, role, team_id }) {
    const text = `
      INSERT INTO employees (name, email, password, role, team_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, role, team_id
    `;
    const values = [name, email, password, role, team_id];
    const result = await db.query(text, values);
    return result.rows[0];
  }
}

module.exports = EmployeeModel;