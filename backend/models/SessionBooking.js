const mongoose = require('mongoose');

const SessionBookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  sessionType: { 
    type: String, 
    enum: ['infrared', 'redlight'], 
    required: true 
  },
  appointmentDate: { 
    type: Date, 
    required: true 
  },
  addGuest: { 
    type: Boolean, 
    default: false 
  },
  aromatherapy: { 
    type: Boolean, 
    default: false 
  },
  halotherapy: { 
    type: Boolean, 
    default: false 
  },
  duration: { 
    type: Number, // in minutes
    required: true 
  },
  status: { 
    type: String,
    enum: ['booked', 'checked-in', 'completed', 'cancelled'],
    default: 'booked'
  },  
  suiteAssignment: {
    type: {
      type: String, // 'sauna' or 'redlight'
      enum: ['sauna', 'redlight'],
      required: false
    },
    number: {
      type: Number,
      required: false
    },
    handicap: {
      type: Boolean,
      default: false
    }
  },
  cancelledAt: Date,
  cancellationFeeApplied: { type: Boolean, default: false },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('SessionBooking', SessionBookingSchema);
