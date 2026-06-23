
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');

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

  // Return safe data only
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
};