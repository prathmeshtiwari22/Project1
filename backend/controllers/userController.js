exports.getProfile = async (req, res) => {
  // req.user is populated by protect middleware
  const user = req.user;
  res.json({ user });
};

exports.updateProfile = async (req, res) => {
  const user = req.user;
  const { username } = req.body;
  if (username) user.username = username;
  await user.save();
  res.json({ user });
};
