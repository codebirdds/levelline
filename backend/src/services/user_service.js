const db = require('../models');
const User = db.User;

const { hashPassword, comparePassword, generateToken } = require('../utils/auth');

class UserService {
  
  // REGISTER USER
  async register(data) {
    const { first_name, last_name, email, mobile, password, role } = data;

    // check existing user
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      first_name,
      last_name,
      email,
      mobile,
      role,
      password: hashedPassword
    });

    return user;
  }

  // LOGIN USER
  async login(data) {
    const { email, password } = data;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return { user, token };
  }
}

module.exports = new UserService();