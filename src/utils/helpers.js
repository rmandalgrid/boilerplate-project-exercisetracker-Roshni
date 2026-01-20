/**
 * Utilities Module
 * Combines validation, date formatting, and custom error classes
 */

// ==================== CUSTOM ERROR CLASSES ====================

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
}

class DatabaseError extends AppError {
  constructor(message) {
    super(message, 500);
  }
}

// ==================== DATE UTILITIES ====================

/**
 * Get current date in YYYY-MM-DD format
 */
function getCurrentDate() {
  const now = new Date();
  return formatDateToYYYYMMDD(now);
}

/**
 * Format a date to YYYY-MM-DD
 */
function formatDateToYYYYMMDD(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Convert YYYY-MM-DD to a Date string (e.g., "Mon Jan 01 2024")
 */
function formatDateString(dateString) {
  const date = new Date(dateString + 'T00:00:00.000Z');
  return date.toDateString();
}

// ==================== VALIDATION UTILITIES ====================

/**
 * Validate username
 */
function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required and must be a string' };
  }

  const trimmed = username.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Username cannot be empty' };
  }

  if (trimmed.length > 50) {
    return { valid: false, error: 'Username must be 50 characters or less' };
  }

  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(trimmed)) {
    return { valid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }

  return { valid: true, error: null, value: trimmed };
}

/**
 * Validate exercise description
 */
function validateDescription(description) {
  if (!description || typeof description !== 'string') {
    return { valid: false, error: 'Description is required and must be a string' };
  }

  const trimmed = description.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Description cannot be empty' };
  }

  if (trimmed.length > 500) {
    return { valid: false, error: 'Description must be 500 characters or less' };
  }

  return { valid: true, error: null, value: trimmed };
}

/**
 * Validate duration
 */
function validateDuration(duration) {
  if (duration === undefined || duration === null || duration === '') {
    return { valid: false, error: 'Duration is required' };
  }

  const num = Number(duration);
  
  if (isNaN(num)) {
    return { valid: false, error: 'Duration must be a valid number' };
  }

  if (!Number.isInteger(num)) {
    return { valid: false, error: 'Duration must be an integer' };
  }

  if (num <= 0) {
    return { valid: false, error: 'Duration must be a positive integer' };
  }

  if (num > 10000) {
    return { valid: false, error: 'Duration must be 10000 minutes or less' };
  }

  return { valid: true, error: null, value: num };
}

/**
 * Validate and parse date
 */
function validateDate(dateString) {
  if (!dateString) {
    return { valid: true, error: null, value: null };
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return { valid: false, error: 'Date must be in YYYY-MM-DD format' };
  }

  const date = new Date(dateString + 'T00:00:00.000Z');
  
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date' };
  }

  const parts = dateString.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  if (date.getUTCFullYear() !== year || 
      date.getUTCMonth() + 1 !== month || 
      date.getUTCDate() !== day) {
    return { valid: false, error: 'Invalid date' };
  }

  return { valid: true, error: null, value: dateString };
}

/**
 * Validate user ID
 */
function validateUserId(id) {
  if (!id) {
    return { valid: false, error: 'User ID is required' };
  }

  const num = Number(id);
  
  if (isNaN(num) || !Number.isInteger(num) || num <= 0) {
    return { valid: false, error: 'User ID must be a positive integer' };
  }

  return { valid: true, error: null, value: num };
}

/**
 * Validate limit parameter
 */
function validateLimit(limit) {
  if (!limit) {
    return { valid: true, error: null, value: null };
  }

  const num = Number(limit);
  
  if (isNaN(num) || !Number.isInteger(num) || num <= 0) {
    return { valid: false, error: 'Limit must be a positive integer' };
  }

  if (num > 1000) {
    return { valid: false, error: 'Limit cannot exceed 1000' };
  }

  return { valid: true, error: null, value: num };
}

// ==================== EXPORTS ====================

module.exports = {
  // Error classes
  AppError,
  ValidationError,
  NotFoundError,
  DatabaseError,
  
  // Date utilities
  getCurrentDate,
  formatDateToYYYYMMDD,
  formatDateString,
  
  // Validation functions
  validateUsername,
  validateDescription,
  validateDuration,
  validateDate,
  validateUserId,
  validateLimit
};

