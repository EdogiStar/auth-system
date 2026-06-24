
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');

const loginUser = async (userData) => {
  const { email, password } = userData;

  // Check exiting user
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  // compare passwords 
  const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch){
    throw new Error('INVALID_CREDENTIALS');
  }
  
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
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
  loginUser
};