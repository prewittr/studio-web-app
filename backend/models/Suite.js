// backend/models/Suite.js
const mongoose = require('mongoose');

const SuiteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['sauna', 'redlight'], required: true },
  suiteNumber: { type: Number, required: true },
  ada: { type: Boolean, default: false }  // New field: true if this suite is ADA accessible
});

module.exports = mongoose.model('Suite', SuiteSchema);
