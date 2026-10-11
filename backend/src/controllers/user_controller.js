const userService = require('../services/user_service');

// REGISTER
exports.register = async (req, res) => {
  try {
    const user = await userService.register(req.body);

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const result = await userService.login(req.body);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


exports.resetPassword = async (req, res) => { try { const result = await userService.resetPassword(req.body); return res.status(200).json({ success: true, message: 'Password reset successfully', data: result }); } catch (error) { return res.status(400).json({ success: false, message: error.message }); } };