# Auth System

A secure backend authentication system built with Node.js, Express.js, MongoDB, and JWT.

# Features

- User Registration
- User Login
- Access Token Authentication (JWT)
- Refresh Token Support
- Token Refresh Flow
- Logout with Refresh Token Revocation
- Role-Based Authorization
- Password Reset (Forgot / Reset Password)
- Authentication Middleware
- Input Validation with Joi
- Automated API Testing with Jest & Supertest

# Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Joi
- Jest
- Supertest

Installation

npm install

# Environment Variables

Create a ".env" file:

PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

Run Locally

npm start

Run Tests

npm test

# API Routes

POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password

