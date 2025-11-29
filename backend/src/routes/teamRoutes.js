const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/teams/:teamId/schedule
router.get(
  '/:teamId/schedule',
  protect,
  teamController.getTeamSchedule
);

module.exports = router;