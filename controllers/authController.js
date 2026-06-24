
const Joi = require('joi');

const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { error } = validateUserRegistration(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const loginData = await authService.registerUser(req.body);

    return res.status(200).json({
        message: 'Logged in successfully',
        data: loginData
    });
  } catch (error) {

    if (error.message === 'EMAIL_EXISTS') {
      return res.status(409).json({
        message: 'Email already exists',
      });
    }

    return res.status(500).json({
      message: 'Server failure',
    });
  }
};

const login = async (req, res) => {
  try {
    const { error } = validateUserLogin(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const user = await authService.loginUser(req.body);

    return res.status(200).json({
      message: 'Logged in successfully',
      data: user,
    });

  } catch (error) {

    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    return res.status(500).json({
      message: 'Server failure'
    });
  }
};

// login validation 
function validateUserLogin(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
     password: Joi.string().min(8).required()
  });

  return schema.validate(user);
}

// registration Validation

function validateUserRegistration(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
     password: Joi.string().min(8).required()
  });

  return schema.validate(user);
}


module.exports = {
  register,
  login
};