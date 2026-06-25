
const express = require('express');


const router = express.Router();


const { register, login, refresh } = require('../controllers/authController');



// AUTH ROUTES

// register 
router.post('/register', register);

// login 
router.post('/login', login);

// refresh 
router.post('/refresh', refresh);


// Export router
module.exports = router;