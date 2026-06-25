
const express = require('express');


const router = express.Router();


const { register, login, refresh, logout } = require('../controllers/authController');



// AUTH ROUTES

// register 
router.post('/register', register);

// login 
router.post('/login', login);

// refresh access token 
router.post('/refresh', refresh);

// logout
router.post('/logout', logout);


// Export router
module.exports = router;

