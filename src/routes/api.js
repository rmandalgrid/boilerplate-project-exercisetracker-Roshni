const express = require('express');
const { 
  createUser, 
  getAllUsers, 
  createExercise, 
  getExerciseLogs 
} = require('../controllers');

const router = express.Router();

// User routes
router.post('/users', createUser);
router.get('/users', getAllUsers);

// Exercise routes
router.post('/users/:_id/exercises', createExercise);
router.get('/users/:_id/logs', getExerciseLogs);

module.exports = router;

