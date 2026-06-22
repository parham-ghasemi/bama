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
  getSubmittedVillas,
  getProfile,
  getBalance,
  deposit,
  getLikedVillas,
  getPastReservations,      // Add this
  getUpcomingReservations   // Add this
} = require('../controllers/user.controller');
const { auth, isAdmin } = require('../middleware/auth.middleware');


router.post('/signup/send-otp', signupSendOTP);
router.post('/signup/verify', signupVerify);
router.post('/login/send-otp', loginSendOTP);
router.post('/login/verify', loginVerify);

// Protected routes
router.get('/profile', auth, getProfile);
router.patch('/profile', auth, editProfile);
router.get('/users', auth, isAdmin, getAllUsers);
router.get('/history', auth, getHistory);
router.get('/submitted-villas', auth, getSubmittedVillas);
router.get('/balance', auth, getBalance);
router.post('/deposit', auth, deposit);
router.get('/liked-villas', auth, getLikedVillas);
router.get('/past-reservations', auth, getPastReservations);
router.get('/upcoming-reservations', auth, getUpcomingReservations);

module.exports = router;