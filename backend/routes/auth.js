const express = require('express');
const router = express.Router();
const {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.get('/verify/:token', verifyEmail);
router.post('/login', login);
router.post('/forgot', forgotPassword);
router.post('/reset/:token', resetPassword);
router.post('/change-password', protect, changePassword);

module.exports = router;