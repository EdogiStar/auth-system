
const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');
const { register, login, refresh, logout, forgotPassword, resetPassword, } = require('../controllers/authController');


router.get(
  '/admin',
  authMiddleware,
  requireRole('ADMIN'),

  (req, res) => {
    res.status(200).json({
      message:
        'Welcome admin',

      user:
        req.user,
    });
  }
);


router.get(
  '/profile',
  authMiddleware,
  (req, res) => {
    res.status(200).json({
      message:
        'Protected route',

      user:
        req.user,
    });
  }
);


// AUTH ROUTES

// register 
router.post('/register', register);

// login 
router.post('/login', login);

// refresh access token 
router.post('/refresh', refresh);

// logout
router.post('/logout', logout);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);




// Export router
module.exports = router;

