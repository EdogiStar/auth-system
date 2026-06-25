require('dotenv').config();

const request = require('supertest');
const mongoose = require('mongoose');

const connectDB = require('../config/db');
const app = require('../app');

beforeAll(async () => {
  await connectDB();
}, 30000);

afterAll(async () => {
  await mongoose.connection.dropDatabase();

  await mongoose.connection.close();
}, 30000);

describe('Auth API', () => {

  it('should register user', async () => {

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'securepass123',
      });

    expect(response.status).toBe(201);

    expect(response.body.message)
      .toBe('User registered successfully');

    expect(response.body.data)
      .toHaveProperty('email');

  });

});