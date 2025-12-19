const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signupSendOTP = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    let user = await User.findOne({ phoneNumber });
    if (user) return res.status(400).json({ msg: 'User already exists. Please login instead.' });

    user = new User({ phoneNumber });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpiration = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Placeholder for sending OTP (replace with actual SMS service like Twilio)
    console.log(`OTP for ${phoneNumber}: ${otp}`);
    // e.g., await sendSMS(phoneNumber, `Your OTP is ${otp}`);

    res.json({ msg: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.signupVerify = async (req, res) => {
  const { phoneNumber, otp, first, last } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(400).json({ msg: 'User not found' });
    if (Date.now() > user.otpExpiration) return res.status(400).json({ msg: 'OTP expired' });

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid OTP' });

    user.name = { first, last };
    user.otp = undefined;
    user.otpExpiration = undefined;
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.loginSendOTP = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(400).json({ msg: 'User not found' });
    if (!user.name || !user.name.first || !user.name.last) return res.status(400).json({ msg: 'Please complete your signup profile' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpiration = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Placeholder for sending OTP (replace with actual SMS service like Twilio)
    console.log(`OTP for ${phoneNumber}: ${otp}`);
    // e.g., await sendSMS(phoneNumber, `Your OTP is ${otp}`);

    res.json({ msg: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.loginVerify = async (req, res) => {
  const { phoneNumber, otp } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(400).json({ msg: 'User not found' });
    if (Date.now() > user.otpExpiration) return res.status(400).json({ msg: 'OTP expired' });

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid OTP' });

    user.otp = undefined;
    user.otpExpiration = undefined;
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (req.body.pfp) user.pfp = req.body.pfp;
    if (req.body.name) {
      if (req.body.name.first) user.name.first = req.body.name.first;
      if (req.body.name.last) user.name.last = req.body.name.last;
    }
    if (req.body.gender) user.gender = req.body.gender;
    if (req.body.birthdate) user.birthdate = req.body.birthdate;
    if (req.body.email) user.email = req.body.email;
    if (req.body.homeNumber) user.homeNumber = req.body.homeNumber;
    if (req.body.bio) user.bio = req.body.bio;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('name phoneNumber email createdAt lastLogin history submittedVillas');
    const result = users.map(u => ({
      name: u.name ? `${u.name.first || ''} ${u.name.last || ''}`.trim() : '',
      phoneNumber: u.phoneNumber,
      email: u.email,
      lastLoginDate: u.lastLogin,
      signupDate: u.createdAt,
      numReservations: u.history.length,
      numSubmittedVillas: u.submittedVillas.length
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};