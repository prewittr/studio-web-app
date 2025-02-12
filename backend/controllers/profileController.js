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
      console.log("Update Profile Request Body:", req.body); // Log the incoming data
      // Build the update object based on allowed fields.
      const updates = {
        preferredName: req.body.preferredName,
        address: {
          street: req.body.street,
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zip,
          country: req.body.country
        },
        birthday: req.body.birthday,
        profilePicture: req.body.profilePicture  // if applicable
      };
  
      // Optionally, remove undefined fields from updates:
      Object.keys(updates).forEach(key => {
        if (updates[key] === undefined) {
          delete updates[key];
        }
      });
  
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
  
