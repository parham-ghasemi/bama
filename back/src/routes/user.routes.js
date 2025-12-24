const express = require('express');
const router = express.Router();
const {
  signupSendOTP,
  signupVerify,
  loginSendOTP,
  loginVerify,
  editProfile,
  getAllUsers,
  getHistory,
  getSubmittedVillas
} = require('../controllers/user.controller');
const { auth, isAdmin } = require('../middleware/auth.middleware');


router.post('/signup/send-otp', signupSendOTP);
router.post('/signup/verify', signupVerify);
router.post('/login/send-otp', loginSendOTP);
router.post('/login/verify', loginVerify);

// Protected routes
router.patch('/profile', auth, editProfile);
router.get('/users', auth, isAdmin, getAllUsers);
router.get('/history', auth, getHistory);
router.get('/submitted-villas', auth, getSubmittedVillas);

module.exports = router;