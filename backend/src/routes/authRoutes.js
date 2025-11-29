const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authController = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');

// Validation Schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// POST /api/auth/login
router.post(
  '/login', 
  validateRequest(loginSchema), 
  authController.login
);

module.exports = router;