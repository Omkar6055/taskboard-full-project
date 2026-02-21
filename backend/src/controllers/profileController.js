const User = require('../models/User');

// GET /api/profile
const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

// PUT /api/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (bio !== undefined) updateFields.bio = bio;
    if (avatar !== undefined) updateFields.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.json({ message: 'Profile updated.', user });
  } catch (err) {
    next(err);
  }
};

// PUT /api/profile/password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, changePassword };
