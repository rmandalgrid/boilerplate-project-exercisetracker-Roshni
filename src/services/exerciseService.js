const ExerciseModel = require('../models/Exercise');
const UserService = require('./userService');
const { 
  ValidationError, 
  NotFoundError, 
  DatabaseError,
  validateDescription, 
  validateDuration, 
  validateDate,
  validateUserId,
  validateLimit,
  getCurrentDate, 
  formatDateString 
} = require('../utils/helpers');

/**
 * Exercise Service
 * Contains business logic for exercise operations
 */
class ExerciseService {
  /**
   * Create a new exercise for a user
   * @param {string|number} userId - The user ID
   * @param {object} exerciseData - The exercise data
   * @param {string} exerciseData.description - Exercise description
   * @param {number|string} exerciseData.duration - Exercise duration in minutes
   * @param {string} exerciseData.date - Exercise date (YYYY-MM-DD) - optional
   * @returns {object} The created exercise with user info
   */
  static createExercise(userId, { description, duration, date }) {
    // Validate user ID
    const userIdValidation = validateUserId(userId);
    if (!userIdValidation.valid) {
      throw new ValidationError(userIdValidation.error);
    }

    // Validate description
    const descValidation = validateDescription(description);
    if (!descValidation.valid) {
      throw new ValidationError(descValidation.error);
    }

    // Validate duration
    const durationValidation = validateDuration(duration);
    if (!durationValidation.valid) {
      throw new ValidationError(durationValidation.error);
    }

    // Validate date
    const dateValidation = validateDate(date);
    if (!dateValidation.valid) {
      throw new ValidationError(dateValidation.error);
    }

    try {
      // Check if user exists
      const user = UserService.getUserById(userIdValidation.value);

      // Use current date if not provided
      const exerciseDate = dateValidation.value || getCurrentDate();

      // Create exercise
      const exercise = ExerciseModel.create({
        userId: userIdValidation.value,
        description: descValidation.value,
        duration: durationValidation.value,
        date: exerciseDate
      });

      // Return response with user info and formatted date
      return {
        userId: user.id,
        username: user.username,
        exerciseId: exercise.id,
        description: exercise.description,
        duration: exercise.duration,
        date: formatDateString(exercise.date)
      };
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Failed to create exercise');
    }
  }

  /**
   * Get exercise logs for a user
   * @param {string|number} userId - The user ID
   * @param {object} filters - Optional filters
   * @param {string} filters.from - Start date (YYYY-MM-DD)
   * @param {string} filters.to - End date (YYYY-MM-DD)
   * @param {number|string} filters.limit - Maximum number of results
   * @returns {object} User exercise log with count
   */
  static getExerciseLog(userId, filters = {}) {
    // Validate user ID
    const userIdValidation = validateUserId(userId);
    if (!userIdValidation.valid) {
      throw new ValidationError(userIdValidation.error);
    }

    // Validate from date
    if (filters.from) {
      const fromValidation = validateDate(filters.from);
      if (!fromValidation.valid) {
        throw new ValidationError(`Invalid 'from' date: ${fromValidation.error}`);
      }
      filters.from = fromValidation.value;
    }

    // Validate to date
    if (filters.to) {
      const toValidation = validateDate(filters.to);
      if (!toValidation.valid) {
        throw new ValidationError(`Invalid 'to' date: ${toValidation.error}`);
      }
      filters.to = toValidation.value;
    }

    // Validate limit
    if (filters.limit) {
      const limitValidation = validateLimit(filters.limit);
      if (!limitValidation.valid) {
        throw new ValidationError(limitValidation.error);
      }
      filters.limit = limitValidation.value;
    }

    try {
      // Check if user exists
      const user = UserService.getUserById(userIdValidation.value);

      // Get exercises with filters
      const exercises = ExerciseModel.findByUserId(userIdValidation.value, filters);

      // Get total count (without limit)
      const totalCount = ExerciseModel.countByUserId(userIdValidation.value, {
        from: filters.from,
        to: filters.to
      });

      // Format exercises
      const logs = exercises.map(exercise => ({
        id: exercise.id,
        description: exercise.description,
        duration: exercise.duration,
        date: formatDateString(exercise.date)
      }));

      return {
        id: user.id,
        username: user.username,
        count: totalCount,
        logs
      };
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Failed to fetch exercise logs');
    }
  }
}

module.exports = ExerciseService;

