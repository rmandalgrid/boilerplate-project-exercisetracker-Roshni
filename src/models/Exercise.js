const db = require('../database/db');

/**
 * Exercise Model
 * Handles all database operations related to exercises
 */
class ExerciseModel {
  /**
   * Create a new exercise
   * @param {object} exerciseData - The exercise data
   * @param {number} exerciseData.userId - The user ID
   * @param {string} exerciseData.description - The exercise description
   * @param {number} exerciseData.duration - The exercise duration in minutes
   * @param {string} exerciseData.date - The exercise date (YYYY-MM-DD format)
   * @returns {object} The created exercise
   */
  static create({ userId, description, duration, date }) {
    const stmt = db.prepare(`
      INSERT INTO exercises (user_id, description, duration, date)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(userId, description, duration, date);
    
    return {
      id: result.lastInsertRowid,
      userId,
      description,
      duration,
      date
    };
  }

  /**
   * Find exercises by user ID with optional filters
   * @param {number} userId - The user ID
   * @param {object} filters - Optional filters
   * @param {string} filters.from - Start date (YYYY-MM-DD)
   * @param {string} filters.to - End date (YYYY-MM-DD)
   * @param {number} filters.limit - Maximum number of results
   * @returns {Array} Array of exercises
   */
  static findByUserId(userId, filters = {}) {
    let query = 'SELECT id, description, duration, date FROM exercises WHERE user_id = ?';
    const params = [userId];

    // Add date range filters
    if (filters.from) {
      query += ' AND date >= ?';
      params.push(filters.from);
    }

    if (filters.to) {
      query += ' AND date <= ?';
      params.push(filters.to);
    }

    // Order by date
    query += ' ORDER BY date DESC';

    // Add limit
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    const stmt = db.prepare(query);
    return stmt.all(...params);
  }

  /**
   * Count exercises for a user with optional date filters
   * @param {number} userId - The user ID
   * @param {object} filters - Optional filters
   * @param {string} filters.from - Start date (YYYY-MM-DD)
   * @param {string} filters.to - End date (YYYY-MM-DD)
   * @returns {number} The count of exercises
   */
  static countByUserId(userId, filters = {}) {
    let query = 'SELECT COUNT(*) as count FROM exercises WHERE user_id = ?';
    const params = [userId];

    if (filters.from) {
      query += ' AND date >= ?';
      params.push(filters.from);
    }

    if (filters.to) {
      query += ' AND date <= ?';
      params.push(filters.to);
    }

    const stmt = db.prepare(query);
    const result = stmt.get(...params);
    return result.count;
  }
}

module.exports = ExerciseModel;

