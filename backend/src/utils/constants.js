module.exports = {
  // User Roles
  ROLES: {
    ADMIN: 'admin',
    SCHEDULER: 'scheduler',
    EMPLOYEE: 'employee'
  },

  // Anomaly Types
  ANOMALIES: {
    LATE_ARRIVAL: 'LATE_ARRIVAL',
    EARLY_EXIT: 'EARLY_EXIT',
    LOCATION_MISMATCH: 'LOCATION_MISMATCH'
  },

  // Error Messages
  ERRORS: {
    CONFLICT: 'Schedule Conflict: Employee overlap detected.',
    QUALIFICATION: 'Qualification Error: Employee does not meet role requirements.',
    TEAM_MISMATCH: 'Team Error: Employee cannot be assigned to a different team.',
    NOT_FOUND: 'Resource not found.',
    UNAUTHORIZED: 'Not authorized to access this resource.'
  },

  // Thresholds (in minutes/meters)
  THRESHOLDS: {
    LATE_MARGIN_MINUTES: 5,
    EARLY_EXIT_MARGIN_MINUTES: 10,
    MAX_DISTANCE_METERS: 200
  }
};