const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true, // Required field
  },
  lastName: {
    type: String,
    required: true, // Required field
  },
  preferredName: {
    type: String,
  },
  email: {
    type: String,
    required: true, // Required field
    unique: true,
    trim: true,
  },
  contactNumber: { type: String },            
  membershipType: { type: String },             // (e.g., "Basic", "Premium")
  membershipStatus: { type: String, default: 'Active' }, // Could be Active, Expired, etc.
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
  },
  birthday: {
    type: Date,
  },
  profilePicture: { type: String }, // Will store Base64 data or a URL
  role: {
    type: String,
    enum: ['member', 'staff', 'admin'],
    default: 'member',
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
