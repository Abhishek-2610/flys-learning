// Accepts an array of allowed roles
// Usage: router.post('/', protect, authorize(['admin', 'scheduler']), createShift);
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    // req.user is set by authMiddleware
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: Role '${req.user?.role}' is not authorized to access this resource.` 
      });
    }
    next();
  };
};

module.exports = { authorize };