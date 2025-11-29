const express = require('express');
const router = express.Router();
const Joi = require('joi');
const shiftController = require('../controllers/shiftController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');

// Validation Schemas
const createShiftSchema = Joi.object({
  team_id: Joi.number().integer().required(),
  start_time: Joi.date().iso().required(),
  end_time: Joi.date().iso().greater(Joi.ref('start_time')).required(), // End must be after Start
  required_roles: Joi.array().items(Joi.string()).min(1).required()
});

const assignSchema = Joi.object({
  employeeId: Joi.number().integer().required()
});

// POST /api/shifts (Create Shift)
// Protected: Only Admin/Scheduler can create shifts
router.post(
  '/',
  protect,
  authorize(['admin', 'scheduler']),
  validateRequest(createShiftSchema),
  shiftController.createShift
);

// POST /api/shifts/:shiftId/assign (Assign Employee)
// Protected: Only Admin/Scheduler can assign
router.post(
  '/:shiftId/assign',
  protect,
  authorize(['admin', 'scheduler']),
  validateRequest(assignSchema),
  shiftController.assignShift
);

module.exports = router;