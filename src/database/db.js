const Database = require('better-sqlite3');
const path = require('path');

// Initialize SQLite database
const db = new Database(path.join(__dirname, '../../exercise-tracker.db'), { 
  verbose: process.env.NODE_ENV === 'development' ? console.log : null 
});

// Enable foreign keys
db.pragma('foreign_keys = ON');

module.exports = db;

