const db = require('../../config/db-sql');

class TeamModel {
  static async findById(id) {
    const text = `SELECT * FROM teams WHERE id = $1`;
    const result = await db.query(text, [id]);
    return result.rows[0];
  }

  static async findAll() {
    const text = `SELECT * FROM teams`;
    const result = await db.query(text);
    return result.rows;
  }
}

module.exports = TeamModel;