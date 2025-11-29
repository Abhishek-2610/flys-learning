const express = require('express');
const router = express.Router();
const Joi = require('joi');
const attendanceController = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

// Validation Schemas
const clockInSchema = Joi.object({
  employeeId: Joi.number().required(),
  shiftId: Joi.number().optional(), 
  location: Joi.object({
    lat: Joi.number().required(),
    long: Joi.number().required()
  }).required()
});

const clockOutSchema = Joi.object({
  employeeId: Joi.number().required(),
  location: Joi.object({
    lat: Joi.number().required(),
    long: Joi.number().required()
  }).required()
});

// POST /api/attendance/clockin
router.post(
  '/clockin',
  protect,
  validateRequest(clockInSchema),
  attendanceController.clockIn
);

// POST /api/attendance/clockout
router.post(
  '/clockout',
  protect,
  validateRequest(clockOutSchema),
  attendanceController.clockOut
);

// GET /api/attendance
router.get(
  '/',
  protect,
  attendanceController.getAttendanceLogs
);

module.exports = router;