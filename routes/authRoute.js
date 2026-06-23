
const express = require('express');


const router = express.Router();


const { register } = require('../controllers/authController');



// Auth Routes
router.post('/register', register);




// Export router
module.exports = router;