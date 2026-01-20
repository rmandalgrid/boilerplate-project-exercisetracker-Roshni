const db = require('../database/db');

/**
 * User Model
 * Handles all database operations related to users
 */
class UserModel {
  /**
   * Create a new user
   * @param {string} username - The username
   * @returns {object} The created user with id and username
   */
  static create(username) {
    const stmt = db.prepare('INSERT INTO users (username) VALUES (?)');
    const result = stmt.run(username);
    return {
      id: result.lastInsertRowid,
      username
    };
  }

  /**
   * Find a user by ID
   * @param {number} id - The user ID
   * @returns {object|null} The user object or null if not found
   */
  static findById(id) {
    const stmt = db.prepare('SELECT id, username FROM users WHERE id = ?');
    return stmt.get(id);
  }

  /**
   * Find a user by username
   * @param {string} username - The username
   * @returns {object|null} The user object or null if not found
   */
  static findByUsername(username) {
    const stmt = db.prepare('SELECT id, username FROM users WHERE username = ?');
    return stmt.get(username);
  }

  /**
   * Get all users
   * @returns {Array} Array of all users
   */
  static findAll() {
    const stmt = db.prepare('SELECT id, username FROM users ORDER BY id');
    return stmt.all();
  }

  /**
   * Check if a user exists by ID
   * @param {number} id - The user ID
   * @returns {boolean} True if user exists, false otherwise
   */
  static exists(id) {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM users WHERE id = ?');
    const result = stmt.get(id);
    return result.count > 0;
  }
}

module.exports = UserModel;

