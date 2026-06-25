
const Joi = require('joi');

const authService = require('../services/authService');


const resetPassword = async (req, res) => {
  try {

    const { error } =
      validateResetPassword(
        req.body
      );

    if (error) {
      return res.status(400).json({
        message:
          error.details[0].message,
      });
    }

    const {
      token,
      password,
    } = req.body;

    await authService
      .resetPassword(
        token,
        password
      );

    return res.status(200).json({
      message:
        'Password reset successful',
    });

  } catch (error) {

    if (
      error.message ===
      'INVALID_RESET_TOKEN'
    ) {
      return res.status(401).json({
        message:
          'Invalid or expired reset token',
      });
    }

    return res.status(500).json({
      message:
        'Server failure',
    });
  }
};


const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    const { error } = validateForgotPassword(req.body);

    if (error) {
      return res.status(400).json({
        message:
          error.details[0].message,
      });
    }

    const result = await authService.forgotPassword(email);

    return res.status(200).json({
      message:
        'If the account exists, a reset link was created',
      data: result,
    });

  } catch (error) {

    return res.status(500).json({
      message:
        'Server failure',
    });
  }
};


const logout = async (req, res) => {
    try{
        const { refreshToken } = req.body;
        
        if(!refreshToken){
            return res.status(400).json({
                message: 'Refresh token is required',
            });
        }
        
        await authService.logoutUser(refreshToken);
        
        return res.status(200).json({
            message: 'Logged out successfully',
        });
        
    }catch(error){
        
        if(error === 'INVALID_REFRESH_TOKEN'){
            return(
                res.status(401).json({
                    message: 'Invalid refresh token',
                })
            );
        }
        
        return res.status(500).json({
            message: error.message,
        });
    }
};


const refresh = async (req, res) => {
    try{
        const { refreshToken } = req.body;
        if(!refreshToken){
            return res.status(400).json({
                message: 'Refresh token is required',
            });
        }
        
        const tokens = await authService.refreshAccessToken(refreshToken);
        
        return res.status(200).json({
            message: 'Access token refreshed successfully',
            data: tokens,
        });
    }catch(error){
        if(error.message === 'INVALID_REFRESH_TOKEN'){
            return res.status(401).json({
                message: 'Invalid refresh token',
            });
        }
        
        return res.status(500).json({
            message: error.message,
        });
    }
};

const register = async (req, res) => {
  try {
    const { error } = validateUserRegistration(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const loginData = await authService.registerUser(req.body);

    return res.status(201).json({
        message: 'User registered successfully',
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

    return res.status(201).json({
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
      message: 'Server failure',
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

// forgotPassword validation 
function validateForgotPassword(user) {
  const schema = Joi.object({
      email: Joi.string().email().required(),
    });

  return schema.validate(
    user
  );
}

// reset password validation 
function validateResetPassword(
  data
) {

  const schema =
    Joi.object({
      token:
        Joi.string()
          .required(),

      password:
        Joi.string()
          .min(8)
          .required(),
    });

  return schema.validate(
    data
  );
}


module.exports = {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
};

