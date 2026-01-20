const UserModel = require('../models/User');
const { 
  ValidationError, 
  NotFoundError, 
  DatabaseError,
  validateUsername, 
  validateUserId 
} = require('../utils/helpers');

/**
 * User Service
 * Contains business logic for user operations
 */
class UserService {
  /**
   * Create a new user
   * @param {string} username - The username
   * @returns {object} The created user
   */
  static createUser(username) {
    // Validate username
    const validation = validateUsername(username);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    try {
      // Check if username already exists
      const existingUser = UserModel.findByUsername(validation.value);
      if (existingUser) {
        throw new ValidationError('Username already exists');
      }

      // Create user
      const user = UserModel.create(validation.value);
      return user;
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new ValidationError('Username already exists');
      }
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError('Failed to create user');
    }
  }

  /**
   * Get all users
   * @returns {Array} Array of all users
   */
  static getAllUsers() {
    try {
      return UserModel.findAll();
    } catch (error) {
      throw new DatabaseError('Failed to fetch users');
    }
  }

  /**
   * Get user by ID
   * @param {string|number} userId - The user ID
   * @returns {object} The user object
   */
  static getUserById(userId) {
    // Validate user ID
    const validation = validateUserId(userId);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    try {
      const user = UserModel.findById(validation.value);
      if (!user) {
        throw new NotFoundError('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Failed to fetch user');
    }
  }

  /**
   * Check if user exists
   * @param {number} userId - The user ID
   * @returns {boolean} True if user exists
   */
  static userExists(userId) {
    try {
      return UserModel.exists(userId);
    } catch (error) {
      throw new DatabaseError('Failed to check user existence');
    }
  }
}

module.exports = UserService;

