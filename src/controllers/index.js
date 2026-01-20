const UserService = require('../services/userService');
const ExerciseService = require('../services/exerciseService');

/**
 * API Controllers
 * Handles all HTTP requests for the Exercise Tracker API
 */

// ==================== USER CONTROLLERS ====================

/**
 * POST /api/users - Create a new user
 */
function createUser(req, res, next) {
  try {
    const { username } = req.body;
    const user = UserService.createUser(username);
    
    res.status(201).json({
      id: user.id,
      username: user.username
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/users - Get all users
 */
function getAllUsers(req, res, next) {
  try {
    const users = UserService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

// ==================== EXERCISE CONTROLLERS ====================

/**
 * POST /api/users/:_id/exercises - Create a new exercise for a user
 */
function createExercise(req, res, next) {
  try {
    const userId = req.params._id;
    const { description, duration, date } = req.body;

    const result = ExerciseService.createExercise(userId, {
      description,
      duration,
      date
    });

    res.status(201).json({
      _id: result.userId,
      username: result.username,
      description: result.description,
      duration: result.duration,
      date: result.date
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/users/:_id/logs - Get exercise logs for a user
 */
function getExerciseLogs(req, res, next) {
  try {
    const userId = req.params._id;
    const { from, to, limit } = req.query;

    const result = ExerciseService.getExerciseLog(userId, {
      from,
      to,
      limit
    });

    res.json({
      _id: result.id,
      username: result.username,
      count: result.count,
      log: result.logs
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUser,
  getAllUsers,
  createExercise,
  getExerciseLogs
};

