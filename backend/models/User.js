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
  contactNumber: { 
    type: String 
  },            
 membershipType: {
  type: String,
  enum: ['none', 'infinite_heat', 'balanced_heat', 'ember_heat', 'radiant_glow', 'vip'],
  default: 'none'
},
membershipStatus: {
  type: String,
  enum: ['None', 'active', 'trialing', 'past_due', 'canceled', 'unpaid'], // Add other Stripe subscription statuses as needed
  default: 'None'
},
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
  },
  membershipExpiresAt: { 
    type: Date 
  }, // optional expiration date if applicable
  // For tracking if the membership has been paid for:
  membershipPaid: { 
    type: Boolean, 
    default: false
  },
  birthday: {
    type: Date,
  },
  profilePicture: { 
    type: String 
  }, // Will store Base64 data or a URL
  role: {
    type: String,
    enum: ['member', 'staff', 'admin'],
    default: 'member',
  },
  ada: { // ADA designator; updated only by admin
    type: Boolean, 
    default: false 
  },
  stripeCustomerId: {
    type: String,
  }, 
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
