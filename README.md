# 🔐 Authentication System API (3MTT Project)

A production-style authentication system built with Node.js, Express, and MongoDB.
It handles user registration, login, JWT authentication, refresh tokens, role-based access control, and password reset functionality.


---

# 🚀 Features

User registration with password hashing (bcryptjs)

Secure login with JWT access & refresh tokens

Token refresh & logout (token revocation support)

Role-Based Access Control (USER / ADMIN)

Password reset with single-use token (15 min expiry)

Input validation using Joi

MongoDB with Mongoose ODM

Secure environment variable configuration



---

# 🛠️ Tech Stack

Node.js

Express.js

MongoDB

Mongoose

JWT (jsonwebtoken)

bcryptjs

Joi

dotenv

cors



---

# 📁 Project Structure

auth_system/
│
├── config/
│   └── db.js
│
├── controllers/
│   └── authController.js
│
├── models/
│   ├── UserModel.js
│   ├── RefreshToken.js
│   └── PasswordReset.js
│
├── routes/
│   └── authRoute.js
│
├── services/
│   └── authService.js
│
├── index.js
├── .env
└── package.json


---

# ⚙️ Installation & Setup

1. Clone repository

git clone https://github.com/EdogiStar/auth-system.git
cd auth-system


---

2. Install dependencies

npm install


---

3. Setup environment variables

Create a .env file:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_access_token_secret
REFRESH_SECRET=your_refresh_token_secret


---

4. Run server

node index.js

or (recommended during development):

npx nodemon index.js


---

# 📌 API Endpoints

Auth Routes

Method	Endpoint	Description

POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
POST	/api/auth/refresh	Refresh access token
POST	/api/auth/logout	Logout user



---

Example Request (Register)

curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"John","email":"john@example.com","password":"12345678"}'


---

# 🔐 Authentication Flow

Register → Login → Access Token
                    ↓
              Refresh Token (httpOnly cookie recommended)
                    ↓
                 Protected Routes
                 
                 
