// Middleware factory that takes a Joi schema
const validateRequest = (schema) => {
  return (req, res, next) => {
    // Validate request body against the schema
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      // Format Joi errors into a clean message
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ 
        message: 'Validation Error', 
        errors 
      });
    }
    
    next();
  };
};

module.exports = validateRequest;