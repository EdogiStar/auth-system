
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {

    // Authorization header
    const authHeader = req.headers.authorization;

    // If header exists
    if (!authHeader) {
      return res.status(401).json({
        message:
          'Access token required',
      });
    }

    // Extracted token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message:
          'Access token required',
      });
    }

    // token verification 
    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    // Attaching user
    req.user = decoded;

    // Continue
    next();

  } catch (error) {

    return res.status(401).json({
      message:
        'Invalid access token',
    });
  }
};

module.exports =
  authMiddleware;
  
  