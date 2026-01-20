const db = require('./db');

/**
 * Run database migrations to create tables
 */
function runMigrations() {
  try {
    // Create users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create exercises table
    db.exec(`
      CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        description TEXT NOT NULL,
        duration INTEGER NOT NULL,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create index on user_id for faster queries
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_exercises_user_id 
      ON exercises(user_id)
    `);

    // Create index on date for faster date range queries
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_exercises_date 
      ON exercises(date)
    `);

    console.log('✓ Database migrations completed successfully');
  } catch (error) {
    console.error('✗ Database migration failed:', error.message);
    throw error;
  }
}

module.exports = { runMigrations };

