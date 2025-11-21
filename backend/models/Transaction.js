const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
type: { type: String, enum: ['income', 'expense'], required: true },
description: { type: String },
amount: { type: Number, required: true },
date: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Transaction', transactionSchema);