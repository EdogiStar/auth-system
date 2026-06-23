
const Joi = require('joi');

const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { error } = validateUser(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const user = await authService.registerUser(req.body);

    return res.status(201).json({
      message: 'User registered successfully',
      data: user,
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


// Validation

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
     password: Joi.string().min(8).required()
  });

  return schema.validate(user);
}


module.exports = {
  register,
};