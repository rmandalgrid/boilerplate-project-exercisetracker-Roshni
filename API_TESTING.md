# API Testing Examples

This file contains example API requests for testing the Exercise Tracker API using tools like curl, Postman, or Insomnia.

## Base URL
```
http://localhost:3000/api
```

## 1. Create Users

### Create first user
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=john_doe"
```

Expected Response:
```json
{
  "id": 1,
  "username": "john_doe"
}
```

### Create second user
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=jane_smith"
```

Expected Response:
```json
{
  "id": 2,
  "username": "jane_smith"
}
```

### Try to create duplicate user (should fail)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=john_doe"
```

Expected Response (400 Bad Request):
```json
{
  "error": "Username already exists"
}
```

## 2. Get All Users

```bash
curl http://localhost:3000/api/users
```

Expected Response:
```json
[
  {
    "id": 1,
    "username": "john_doe"
  },
  {
    "id": 2,
    "username": "jane_smith"
  }
]
```

## 3. Add Exercises

### Add exercise with all fields
```bash
curl -X POST http://localhost:3000/api/users/1/exercises \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "description=Running in the park&duration=30&date=2024-01-15"
```

Expected Response:
```json
{
  "_id": 1,
  "username": "john_doe",
  "description": "Running in the park",
  "duration": 30,
  "date": "Mon Jan 15 2024"
}
```

### Add exercise without date (uses current date)
```bash
curl -X POST http://localhost:3000/api/users/1/exercises \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "description=Swimming&duration=45"
```

### Add more exercises for testing
```bash
# Exercise with older date
curl -X POST http://localhost:3000/api/users/1/exercises \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "description=Cycling&duration=60&date=2024-01-10"

# Exercise with newer date
curl -X POST http://localhost:3000/api/users/1/exercises \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "description=Yoga&duration=40&date=2024-01-20"

# Exercise with mid-range date
curl -X POST http://localhost:3000/api/users/1/exercises \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "description=Weight training&duration=50&date=2024-01-12"
```

### Try invalid exercise (should fail)

Missing duration:
```bash
curl -X POST http://localhost:3000/api/users/1/exercises \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "description=Running"
```

Invalid date format:
```bash
curl -X POST http://localhost:3000/api/users/1/exercises \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "description=Running&duration=30&date=15/01/2024"
```

Non-existent user:
```bash
curl -X POST http://localhost:3000/api/users/999/exercises \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "description=Running&duration=30"
```

## 4. Get Exercise Logs

### Get all exercises for a user
```bash
curl http://localhost:3000/api/users/1/logs
```

Expected Response:
```json
{
  "_id": 1,
  "username": "john_doe",
  "count": 5,
  "log": [
    {
      "id": 4,
      "description": "Yoga",
      "duration": 40,
      "date": "Sat Jan 20 2024"
    },
    {
      "id": 1,
      "description": "Running in the park",
      "duration": 30,
      "date": "Mon Jan 15 2024"
    },
    ...
  ]
}
```

### Filter by from date
```bash
curl "http://localhost:3000/api/users/1/logs?from=2024-01-15"
```

### Filter by to date
```bash
curl "http://localhost:3000/api/users/1/logs?to=2024-01-15"
```

### Filter by date range
```bash
curl "http://localhost:3000/api/users/1/logs?from=2024-01-12&to=2024-01-18"
```

### Limit results
```bash
curl "http://localhost:3000/api/users/1/logs?limit=2"
```

### Combine filters
```bash
curl "http://localhost:3000/api/users/1/logs?from=2024-01-10&to=2024-01-20&limit=3"
```

### Try invalid requests (should fail)

Non-existent user:
```bash
curl http://localhost:3000/api/users/999/logs
```

Invalid date format:
```bash
curl "http://localhost:3000/api/users/1/logs?from=2024/01/15"
```

Invalid limit:
```bash
curl "http://localhost:3000/api/users/1/logs?limit=abc"
```

## 5. Error Handling Examples

### Empty username
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username="
```

### Invalid username (special characters)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@user!"
```

### Negative duration
```bash
curl -X POST http://localhost:3000/api/users/1/exercises \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "description=Running&duration=-10"
```

### Invalid date (February 30th)
```bash
curl -X POST http://localhost:3000/api/users/1/exercises \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "description=Running&duration=30&date=2024-02-30"
```

## Testing with Postman

To test with Postman:

1. Create a new collection called "Exercise Tracker API"
2. Set a collection variable: `baseUrl` = `http://localhost:3000/api`
3. Create requests for each endpoint above
4. Use the Body tab with `x-www-form-urlencoded` for POST requests
5. Save successful responses to test subsequent requests

### Postman Collection Structure

```
Exercise Tracker API/
├── Users/
│   ├── Create User
│   ├── Get All Users
│   └── Create Duplicate User (error test)
├── Exercises/
│   ├── Create Exercise (with date)
│   ├── Create Exercise (without date)
│   ├── Create Exercise (invalid - missing duration)
│   └── Create Exercise (invalid - wrong date format)
└── Logs/
    ├── Get All Logs
    ├── Get Logs (with from filter)
    ├── Get Logs (with to filter)
    ├── Get Logs (with date range)
    ├── Get Logs (with limit)
    └── Get Logs (combined filters)
```

## Testing Workflow

1. **Reset Database**: Delete `exercise-tracker.db` and restart the server to start fresh
2. **Create Users**: Create 2-3 test users
3. **Add Exercises**: Add multiple exercises with different dates
4. **Test Filters**: Try different combinations of filters
5. **Test Errors**: Verify all validation is working properly

## Notes

- All dates must be in `YYYY-MM-DD` format
- Duration must be a positive integer
- The `count` field in logs represents total matches without limit
- Logs are returned in descending date order (newest first)
- The database file `exercise-tracker.db` is created automatically

