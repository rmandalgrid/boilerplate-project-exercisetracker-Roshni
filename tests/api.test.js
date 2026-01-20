const request = require('supertest');
const app = require('../index');
const db = require('../src/database/db');

// Clean up database after each test
afterEach(() => {
  db.exec('DELETE FROM exercises');
  db.exec('DELETE FROM users');
});

// Close database after all tests
afterAll(() => {
  db.close();
});

describe('User API Endpoints', () => {
  describe('POST /api/users', () => {
    it('should create a new user with valid username', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ username: 'testuser' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('username', 'testuser');
    });

    it('should reject empty username', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ username: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject missing username', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject duplicate username', async () => {
      await request(app)
        .post('/api/users')
        .send({ username: 'testuser' });

      const res = await request(app)
        .post('/api/users')
        .send({ username: 'testuser' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('already exists');
    });

    it('should reject username with special characters', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ username: 'test@user!' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users', () => {
    it('should return empty array when no users exist', async () => {
      const res = await request(app).get('/api/users');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return all users', async () => {
      await request(app).post('/api/users').send({ username: 'user1' });
      await request(app).post('/api/users').send({ username: 'user2' });

      const res = await request(app).get('/api/users');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('username', 'user1');
      expect(res.body[1]).toHaveProperty('username', 'user2');
    });
  });
});

describe('Exercise API Endpoints', () => {
  let userId;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ username: 'testuser' });
    userId = res.body.id;
  });

  describe('POST /api/users/:_id/exercises', () => {
    it('should create exercise with all fields', async () => {
      const res = await request(app)
        .post(`/api/users/${userId}/exercises`)
        .send({
          description: 'Running',
          duration: 30,
          date: '2024-01-15'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id', userId);
      expect(res.body).toHaveProperty('username', 'testuser');
      expect(res.body).toHaveProperty('description', 'Running');
      expect(res.body).toHaveProperty('duration', 30);
      expect(res.body).toHaveProperty('date');
      expect(res.body.date).toContain('Mon Jan 15 2024');
    });

    it('should create exercise without date (use current date)', async () => {
      const res = await request(app)
        .post(`/api/users/${userId}/exercises`)
        .send({
          description: 'Swimming',
          duration: 45
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('date');
    });

    it('should reject missing description', async () => {
      const res = await request(app)
        .post(`/api/users/${userId}/exercises`)
        .send({
          duration: 30
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject missing duration', async () => {
      const res = await request(app)
        .post(`/api/users/${userId}/exercises`)
        .send({
          description: 'Running'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject invalid duration (not a number)', async () => {
      const res = await request(app)
        .post(`/api/users/${userId}/exercises`)
        .send({
          description: 'Running',
          duration: 'abc'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject invalid duration (negative)', async () => {
      const res = await request(app)
        .post(`/api/users/${userId}/exercises`)
        .send({
          description: 'Running',
          duration: -5
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject invalid date format', async () => {
      const res = await request(app)
        .post(`/api/users/${userId}/exercises`)
        .send({
          description: 'Running',
          duration: 30,
          date: '15/01/2024'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject invalid date', async () => {
      const res = await request(app)
        .post(`/api/users/${userId}/exercises`)
        .send({
          description: 'Running',
          duration: 30,
          date: '2024-02-30'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .post('/api/users/99999/exercises')
        .send({
          description: 'Running',
          duration: 30
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for invalid user ID', async () => {
      const res = await request(app)
        .post('/api/users/invalid/exercises')
        .send({
          description: 'Running',
          duration: 30
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users/:_id/logs', () => {
    beforeEach(async () => {
      // Add some exercises
      await request(app).post(`/api/users/${userId}/exercises`)
        .send({ description: 'Running', duration: 30, date: '2024-01-10' });
      await request(app).post(`/api/users/${userId}/exercises`)
        .send({ description: 'Swimming', duration: 45, date: '2024-01-15' });
      await request(app).post(`/api/users/${userId}/exercises`)
        .send({ description: 'Cycling', duration: 60, date: '2024-01-20' });
    });

    it('should return all exercises for user', async () => {
      const res = await request(app).get(`/api/users/${userId}/logs`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('_id', userId);
      expect(res.body).toHaveProperty('username', 'testuser');
      expect(res.body).toHaveProperty('count', 3);
      expect(res.body).toHaveProperty('log');
      expect(res.body.log).toHaveLength(3);
      expect(res.body.log[0]).toHaveProperty('description');
      expect(res.body.log[0]).toHaveProperty('duration');
      expect(res.body.log[0]).toHaveProperty('date');
    });

    it('should filter exercises by from date', async () => {
      const res = await request(app)
        .get(`/api/users/${userId}/logs?from=2024-01-15`);

      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(2);
      expect(res.body.log).toHaveLength(2);
    });

    it('should filter exercises by to date', async () => {
      const res = await request(app)
        .get(`/api/users/${userId}/logs?to=2024-01-15`);

      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(2);
      expect(res.body.log).toHaveLength(2);
    });

    it('should filter exercises by date range', async () => {
      const res = await request(app)
        .get(`/api/users/${userId}/logs?from=2024-01-12&to=2024-01-18`);

      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.log).toHaveLength(1);
      expect(res.body.log[0].description).toBe('Swimming');
    });

    it('should limit number of results', async () => {
      const res = await request(app)
        .get(`/api/users/${userId}/logs?limit=2`);

      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(3); // Total count without limit
      expect(res.body.log).toHaveLength(2); // Limited results
    });

    it('should apply both date filters and limit', async () => {
      const res = await request(app)
        .get(`/api/users/${userId}/logs?from=2024-01-10&to=2024-01-20&limit=2`);

      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(3); // Total matching filters
      expect(res.body.log).toHaveLength(2); // Limited results
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app).get('/api/users/99999/logs');

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for invalid from date', async () => {
      const res = await request(app)
        .get(`/api/users/${userId}/logs?from=invalid`);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for invalid limit', async () => {
      const res = await request(app)
        .get(`/api/users/${userId}/logs?limit=abc`);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return empty log for user with no exercises', async () => {
      // Create new user
      const newUser = await request(app)
        .post('/api/users')
        .send({ username: 'newuser' });

      const res = await request(app).get(`/api/users/${newUser.body.id}/logs`);

      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(0);
      expect(res.body.log).toEqual([]);
    });
  });
});

