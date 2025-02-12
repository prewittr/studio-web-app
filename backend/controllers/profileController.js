const User = require('../models/User');

// GET /api/profile
exports.getProfile = async (req, res) => {
  try {
    // req.user.id should be set by your authentication middleware (e.g., JWT verification)
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
};

// PUT /api/profile
exports.updateProfile = async (req, res) => {
  try {
    // Build the update object from the request body; update only the allowed fields.
    const updates = {
      preferredName: req.body.preferredName,
      address: req.body.address,
      birthday: req.body.birthday, // Expecting a date string (ISO)
      paymentMethod: req.body.paymentMethod,
      // Add any other preferences as needed
    };

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true })
                                  .select('-password');
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'Profile updated successfully!', user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: 'Server error updating profile.' });
  }
};
