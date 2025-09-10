const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

// Sign Up
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password, role });
    await user.save();

    // Bonus: Email verification
    const verifyToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = verifyToken; // Reuse field for verification
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const verifyUrl = `https://edu-track-odhk.vercel.app/verify/${verifyToken}`;
    await sendEmail(email, 'Verify Email', `<p>Click <a href="${verifyUrl}">here</a> to verify.</p>`);

    res.status(201).json({ msg: 'User registered. Verify email to login.' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Verify Email (Bonus)

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

    user.isVerified = true;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ msg: 'Email verified successfully' });
  } catch (err) {
    console.error('Verify email error:', err);
    res.status(500).json({ msg: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }
    if (!user.isVerified) return res.status(401).json({ msg: 'Email not verified' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Forgot Password (Bonus)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    const resetUrl = `https://edu-track-odhk.vercel.app/reset/${resetToken}`;
    await sendEmail(email, 'Reset Password', `<p>Click <a href="${resetUrl}">here</a> to reset password.</p>`);
    res.json({ msg: 'Reset link sent' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Reset Password (Bonus)
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Change Password (Bonus, protected)
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(oldPassword))) {
      return res.status(401).json({ msg: 'Invalid old password' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ msg: 'Password changed' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};