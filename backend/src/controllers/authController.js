const authService = require('../services/authService');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Delegate to service for DB lookup and bcrypt check
    const { user, token } = await authService.loginUser(email, password);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        team_id: user.team_id
      }
    });
  } catch (error) {
    // Pass specific auth errors to the global error handler or handle here
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ message: error.message });
    }
    next(error);
  }
};

module.exports = { login };