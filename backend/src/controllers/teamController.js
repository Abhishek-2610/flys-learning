const shiftService = require('../services/shiftService'); // Reusing shift service for schedule logic

const getTeamSchedule = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    
    // Fetch shifts + assignments for this team
    const schedule = await shiftService.getTeamSchedule(teamId);
    
    res.status(200).json({
      teamId,
      data: schedule
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTeamSchedule };