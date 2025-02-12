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
  email: {
    type: String,
    required: true, // Required field
    unique: true,
    trim: true,
  },
  address: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  role: {
    type: String,
    enum: ['member', 'staff', 'admin'],
    default: 'member',
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
