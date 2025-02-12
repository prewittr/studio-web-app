const User = require('../models/User');

// This controller assumes that req.user is set by your authentication middleware.
exports.uploadProfilePicture = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    
    // Convert the file buffer to a Base64 string.
    // You can also determine the MIME type from req.file.mimetype.
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    // Update the user's profilePicture field
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: base64Image },
      { new: true, runValidators: true }
    ).select('-password');  // Exclude the password from the returned document

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    res.json({ message: 'Profile picture updated successfully!', profilePicture: updatedUser.profilePicture });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ message: 'Server error while uploading profile picture.' });
  }
};
