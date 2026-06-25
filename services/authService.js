
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/UserModel');
const RefreshToken = require('../models/RefreshTokenModel');

const refreshAccessToken = async (refreshToken) => {
  try {

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Hash incoming token
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    // Find stored token
    const storedToken =
      await RefreshToken.findOne({
        tokenHash,
      });

    if (!storedToken) {
      throw new Error(
        'INVALID_REFRESH_TOKEN'
      );
    }

    // Check revoked
    if (storedToken.revoked) {
      throw new Error(
        'INVALID_REFRESH_TOKEN'
      );
    }

    // Check expiry
    if (
      storedToken.expiresAt <
      new Date()
    ) {
      throw new Error(
        'INVALID_REFRESH_TOKEN'
      );
    }

    // Find user
    const user =
      await User.findById(
        decoded.id
      );

    if (!user) {
      throw new Error(
        'INVALID_REFRESH_TOKEN'
      );
    }

    // Revoke old refresh token
    storedToken.revoked = true;

    await storedToken.save();

    // Generate NEW access token
    const accessToken =
      jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '15m',
        }
      );

    // Generate NEW refresh token
    const newRefreshToken =
      jwt.sign(
        {
          id: user._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: '7d',
        }
      );

    // Hash new refresh token
    const newTokenHash =
      crypto
        .createHash('sha256')
        .update(newRefreshToken)
        .digest('hex');

    // Expiry
    const expiresAt =
      new Date(
        Date.now() +
        7 * 24 * 60 * 60 * 1000
      );

    // Save new refresh token
    await RefreshToken.create({
      userId: user._id,
      tokenHash: newTokenHash,
      expiresAt,
      revoked: false,
    });

    return {
      accessToken,
      refreshToken:
        newRefreshToken,
    };

  } catch (error) {

    throw new Error(
      'INVALID_REFRESH_TOKEN'
    );
  }
};


const loginUser = async (userData) => {
  const { email, password } = userData;

  // Check existing user
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  // compare passwords 
  const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch){
    throw new Error('INVALID_CREDENTIALS');
  }
  
  // access token
  const payload = {
      id: user._id,
      email: user.email,
      role: user.role
  }
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '15m'});
  
  // refresh token
  const refreshToken = jwt.sign(
      {
          id: user._id
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
          expiresIn: '7d',
      }
  );
  
  // hash refreshToken
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  // token expiry 
  const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
  );
  // save refreshToken
  await RefreshToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
      revoked: false,
  });
  
  return {
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  },
  accessToken,
  refreshToken,
};
  
};

const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Check duplicate email
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error('EMAIL_EXISTS');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({name, email, passwordHash, role: 'USER' });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
};
