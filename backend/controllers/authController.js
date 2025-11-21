const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const OTP = require('../models/OTP');
const User = require('../models/User');
const generateOTP = require('../utils/generateOTP');
const sendEmail = require('../utils/sendEmail');

const otpExpiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES || 10);

function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

exports.signupRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = new User({ username, email, password, isVerified: false });
    await user.save();

    const code = generateOTP(6);
    const expiresAt = moment().add(otpExpiryMinutes, 'minutes').toDate();
    await OTP.create({ email, code, purpose: 'signup', expiresAt });

    await sendEmail(
      email,
      'Your Signup OTP',
      `<p>Your OTP is <b>${code}</b> — expires in ${otpExpiryMinutes} minutes</p>`
    );

    res.json({ message: 'User created. OTP sent to email. Verify to activate account.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifySignupOTP = async (req, res) => {
  const { email, code } = req.body;
  try {
    const record = await OTP.findOne({ email, code, purpose: 'signup' });
    if (!record) return res.status(400).json({ message: 'Invalid OTP' });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVerified = true;
    await user.save();

    await OTP.deleteMany({ email, purpose: 'signup' });

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Not verified? Send signup OTP
    if (!user.isVerified) {
      const code = generateOTP(6);
      const expiresAt = moment().add(otpExpiryMinutes, 'minutes').toDate();

      await OTP.create({ email, code, purpose: 'signin', expiresAt });

      await sendEmail(email, 'Signin OTP', `<p>Your signin OTP is <b>${code}</b></p>`);

      return res.json({ message: 'Account not verified. OTP sent to email.' });
    }

    // Verified: send OTP for login
    const code = generateOTP(6);
    const expiresAt = moment().add(otpExpiryMinutes, 'minutes').toDate();

    await OTP.create({ email, code, purpose: 'signin', expiresAt });

    await sendEmail(email, 'Signin OTP', `<p>Your signin OTP is <b>${code}</b></p>`);

    res.json({ message: 'OTP sent to email for signin. Verify to receive token.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifySigninOTP = async (req, res) => {
  const { email, code } = req.body;

  try {
    const record = await OTP.findOne({ email, code, purpose: 'signin' });
    if (!record) return res.status(400).json({ message: 'Invalid OTP' });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await OTP.deleteMany({ email, purpose: 'signin' });

    const token = generateToken(user);

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.requestForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const code = generateOTP(6);
    const expiresAt = moment().add(otpExpiryMinutes, 'minutes').toDate();
    await OTP.create({ email, code, purpose: 'forgot', expiresAt });

    await sendEmail(email, 'Password Reset OTP', `<p>Your password reset OTP is <b>${code}</b></p>`);

    res.json({ message: 'OTP sent to email' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyForgotOTPAndReset = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const record = await OTP.findOne({ email, code, purpose: 'forgot' });
    if (!record) return res.status(400).json({ message: 'Invalid OTP' });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword;
    await user.save();

    await OTP.deleteMany({ email, purpose: 'forgot' });

    res.json({ message: 'Password updated. You can now sign in.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.requestChangePasswordOTP = async (req, res) => {
  const user = req.user;
  try {
    const code = generateOTP(6);
    const expiresAt = moment().add(otpExpiryMinutes, 'minutes').toDate();

    await OTP.create({ email: user.email, code, purpose: 'change_password', expiresAt });

    await sendEmail(user.email, 'Change Password OTP', `<p>Your change password OTP is <b>${code}</b></p>`);

    res.json({ message: 'OTP sent to your email' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyChangePasswordOTPAndSet = async (req, res) => {
  const user = req.user;
  const { code, newPassword } = req.body;

  try {
    const record = await OTP.findOne({ email: user.email, code, purpose: 'change_password' });
    if (!record) return res.status(400).json({ message: 'Invalid OTP' });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });

    user.password = newPassword;
    await user.save();

    await OTP.deleteMany({ email: user.email, purpose: 'change_password' });

    res.json({ message: 'Password changed' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
