const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { runMigrations } = require('./src/database/migrations');
const apiRoutes = require('./src/routes/api');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');

// Initialize Express app
const app = express();

// Run database migrations on startup
try {
  runMigrations();
} catch (error) {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Home route - serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  const listener = app.listen(PORT, () => {
    console.log('✓ Your app is listening on port ' + listener.address().port);
  });
}

module.exports = app;
