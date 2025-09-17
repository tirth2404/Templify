const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth.middleware');
const {
  validateSignup,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword
} = require('../middleware/validation.middleware');

// Public routes
router.post('/register', validateSignup, register);
router.post('/signup', validateSignup, register); // Alternative endpoint
router.post('/login', validateLogin, login);

// Protected routes
router.get('/me', auth, getProfile);
router.put('/me', auth, validateUpdateProfile, updateProfile);
router.post('/change-password', auth, validateChangePassword, changePassword);
router.post('/logout', auth, logout);

module.exports = router;
