const mongoose = require('mongoose');


const otpSchema = new mongoose.Schema({
email: { type: String, required: true },
code: { type: String, required: true },
purpose: { type: String, enum: ['signup', 'signin', 'forgot', 'change_password'], required: true },
expiresAt: { type: Date, required: true },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('OTP', otpSchema);