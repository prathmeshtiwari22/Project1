const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/signup', [body('email').isEmail(), body('password').isLength({ min: 6 }), body('username').notEmpty()], authController.signupRequest);
router.post('/signup/verify', authController.verifySignupOTP);

router.post('/signin', authController.signin);
router.post('/signin/verify', authController.verifySigninOTP);

router.post('/forgot/request', authController.requestForgotPassword);
router.post('/forgot/verify', authController.verifyForgotOTPAndReset);

router.post('/change-password/request', protect, authController.requestChangePasswordOTP);
router.post('/change-password/verify', protect, authController.verifyChangePasswordOTPAndSet);
module.exports = router;