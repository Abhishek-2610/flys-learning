// Validates if the input is a valid positive integer (ID)
export const isValidId = (id) => {
  return Number.isInteger(Number(id)) && Number(id) > 0;
};

// Validates email format
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Validates that End Time is after Start Time
export const isTimeRangeValid = (startTime, endTime) => {
  if (!startTime || !endTime) return false;
  return new Date(endTime) > new Date(startTime);
};

// Form Validation for Assignment
export const validateAssignmentForm = (shiftId, employeeId) => {
  const errors = {};
  if (!shiftId) errors.shiftId = "Shift ID is required";
  if (!employeeId) errors.employeeId = "Employee ID is required";
  if (shiftId && !isValidId(shiftId)) errors.shiftId = "Invalid Shift ID format";
  if (employeeId && !isValidId(employeeId)) errors.employeeId = "Invalid Employee ID format";
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};