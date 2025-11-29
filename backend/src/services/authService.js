const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const EmployeeModel = require('../models/sql/Employee');

const loginUser = async (email, password) => {
  // 1. Find user
  const user = await EmployeeModel.findByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // 2. Check password [cite: 54]
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // 3. Generate JWT
  const token = jwt.sign(
    { id: user.id, role: user.role, team_id: user.team_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { user, token };
};

module.exports = { loginUser };