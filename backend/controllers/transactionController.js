const Transaction = require('../models/Transaction');

exports.addTransaction = async (req, res) => {
  const { type, description, amount, date } = req.body;
  try {
    const tx = await Transaction.create({ user: req.user._id, type, description, amount, date });
    res.json({ tx });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    // filters
    const { page = 1, limit = 10, type, startDate, endDate, minAmount, maxAmount, sortBy, sortOrder = 'desc' } = req.query;

    const filter = { user: req.user._id };
    if (type) filter.type = type; // income or expense
    if (startDate || endDate) filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
    if (minAmount || maxAmount) filter.amount = {};
    if (minAmount) filter.amount.$gte = Number(minAmount);
    if (maxAmount) filter.amount.$lte = Number(maxAmount);

    // sorting
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.date = -1;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Transaction.countDocuments(filter);
    const txs = await Transaction.find(filter).sort(sort).skip(skip).limit(Number(limit));

    res.json({ page: Number(page), limit: Number(limit), total, transactions: txs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
