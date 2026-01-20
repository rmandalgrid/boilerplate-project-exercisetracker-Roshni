/**
 * Global error handling middleware
 */

function errorHandler(err, req, res, next) {
  // Default to 500 server error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Handle SQLite errors
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.code === 'SQLITE_CONSTRAINT') {
    statusCode = 400;
    if (err.message.includes('username')) {
      message = 'Username already exists';
    } else {
      message = 'Database constraint violation';
    }
  } else if (err.code && err.code.startsWith('SQLITE_')) {
    statusCode = 500;
    message = 'Database error occurred';
    // Log the actual error for debugging
    console.error('Database error:', err);
  }

  // Don't expose internal errors in production
  if (statusCode === 500 && process.env.NODE_ENV === 'production' && !err.isOperational) {
    message = 'Internal server error';
  }

  // Log error for debugging
  if (statusCode === 500) {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    error: message
  });
}

/**
 * Catch 404 and forward to error handler
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: 'Route not found'
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};

