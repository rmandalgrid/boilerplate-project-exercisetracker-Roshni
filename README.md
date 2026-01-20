# Exercise Tracker REST API

A REST API for tracking user exercises, built with Node.js, Express, and SQLite.

## 🚀 Quick Start

```bash
npm install
npm start
```

Server runs on `http://localhost:3000`

## 📸 Screenshots

### API Test Results
![Test Results](screenshots/test-results.png)

### Create User Endpoint
![Create User](screenshots/create-user.png)

### Add Exercise Endpoint
![Add Exercise](screenshots/add-exercise.png)

### Get Exercise Logs
![Exercise Logs](screenshots/exercise-logs.png)

## ✅ Features

- Create users with unique usernames
- Add exercises with description, duration, and date
- Retrieve exercise logs with filtering (date range, limit)
- SQLite database (no external setup needed)
- Input validation and SQL injection protection
- 27 unit tests with 85% coverage

## 📚 API Endpoints

### 1. Create User
**POST** `/api/users`

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=john_doe"
```

**Response:**
```json
{
  "id": 1,
  "username": "john_doe"
}
```

### 2. Get All Users
**GET** `/api/users`

```bash
curl http://localhost:3000/api/users
```

### 3. Add Exercise
**POST** `/api/users/:_id/exercises`

```bash
curl -X POST http://localhost:3000/api/users/1/exercises \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "description=Running&duration=30&date=2024-01-15"
```

**Request Body:**
- `description` (required): Exercise description (max 500 chars)
- `duration` (required): Duration in minutes (positive integer, max 10000)
- `date` (optional): Date in YYYY-MM-DD format (defaults to current date)

**Response:**
```json
{
  "_id": 1,
  "username": "john_doe",
  "description": "Running",
  "duration": 30,
  "date": "Mon Jan 15 2024"
}
```

### 4. Get Exercise Logs
**GET** `/api/users/:_id/logs`

```bash
# Get all exercises
curl http://localhost:3000/api/users/1/logs

# Filter by date range and limit
curl "http://localhost:3000/api/users/1/logs?from=2024-01-01&to=2024-01-31&limit=10"
```

**Query Parameters:**
- `from` (optional): Start date (YYYY-MM-DD)
- `to` (optional): End date (YYYY-MM-DD)
- `limit` (optional): Max results (integer, max 1000)

**Response:**
```json
{
  "_id": 1,
  "username": "john_doe",
  "count": 3,
  "log": [
    {
      "id": 1,
      "description": "Running",
      "duration": 30,
      "date": "Mon Jan 15 2024"
    }
  ]
}
```

## 🏗️ Project Structure

```
src/
├── controllers/    # HTTP request handlers
├── services/       # Business logic
├── models/         # Database operations
├── routes/         # API routes
├── middleware/     # Error handling
├── database/       # DB setup & migrations
└── utils/          # Validation & helpers
```

## 🧪 Testing

```bash
npm test
```

- 27 test cases covering all endpoints
- 85% code coverage

## ⚙️ Configuration

Create a `.env` file (optional):
```bash
PORT=3000
NODE_ENV=development
```

## 📦 Dependencies

**Production:**
- `express` - Web framework
- `better-sqlite3` - SQLite database
- `body-parser` - Request parsing
- `cors` - CORS support
- `dotenv` - Environment variables

**Development:**
- `jest` - Testing framework
- `supertest` - HTTP testing
- `nodemon` - Auto-reload

## 📄 License

MIT
