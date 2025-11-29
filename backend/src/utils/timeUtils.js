/**
 * Adds minutes to a Date object.
 * @param {Date|string} date - The original date
 * @param {number} minutes - Minutes to add (can be negative)
 * @returns {Date} New Date object
 */
const addMinutes = (date, minutes) => {
  const newDate = new Date(date);
  newDate.setTime(newDate.getTime() + minutes * 60 * 1000);
  return newDate;
};

/**
 * Checks if dateA is after dateB.
 * @param {Date|string} dateA 
 * @param {Date|string} dateB 
 * @returns {boolean}
 */
const isAfter = (dateA, dateB) => {
  return new Date(dateA) > new Date(dateB);
};

/**
 * Checks if dateA is before dateB.
 * @param {Date|string} dateA 
 * @param {Date|string} dateB 
 * @returns {boolean}
 */
const isBefore = (dateA, dateB) => {
  return new Date(dateA) < new Date(dateB);
};

module.exports = {
  addMinutes,
  isAfter,
  isBefore
};