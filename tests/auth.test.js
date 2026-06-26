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
        email: `register${Date.now()}@example.com`,
        password: 'securepass123',
      });

    expect(response.status).toBe(201);

    expect(response.body.message)
      .toBe('User registered successfully');

  });

  it('should login successfully', async () => {

    const email =
      `login${Date.now()}@example.com`;

    const password =
      'securepass123';

    // register user first
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Login User',
        email,
        password,
      });

    // login
    const response =
      await request(app)

      .post('/api/auth/login')

      .send({
        email,
        password,
      });

    expect(response.status)
      .toBe(200);

    expect(response.body.message)
      .toBe(
        'Logged in successfully'
      );

    expect(
      response.body.data
    )

    .toHaveProperty(
      'accessToken'
    );

    expect(
      response.body.data
    )

    .toHaveProperty(
      'refreshToken'
    );

  });

  it(
    'should reject invalid password',

    async () => {

      const email =
        `wrong${Date.now()}@example.com`;

      await request(app)
        .post('/api/auth/register')
        .send({
          name:
          'Wrong Password',

          email,

          password:
          'securepass123',
        });

      const response =
        await request(app)

        .post(
          '/api/auth/login'
        )

        .send({

          email,

          password:
          'wrongpass',

        });

      expect(
        response.status
      )

      .toBe(
        401
      );

    }

  );

  it(
    'should reject unknown email',

    async () => {

      const response =

      await request(app)

      .post(
        '/api/auth/login'
      )

      .send({

        email:
        'fake@example.com',

        password:
        'securepass123',

      });

      expect(
        response.status
      )

      .toBe(
        401
      );

    }

  );

});