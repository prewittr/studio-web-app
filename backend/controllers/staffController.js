// backend/controllers/staffController.js
const SessionBooking = require('../models/SessionBooking');

/**
 * Get a single booking by ID (for staff/admin use).
 * This endpoint should be secured (e.g., using a middleware that ensures
 * only staff or admin users can access it).
 */
exports.getBookingById = async (req, res) => {
  try {
    const booking = await SessionBooking.findById(req.params.id).populate('user', 'username');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    res.json({ booking });
  } catch (error) {
    console.error('Error fetching booking by ID:', error);
    res.status(500).json({ message: 'Server error while fetching booking.' });
  }
};

/**
 * (Optional) Update a booking.
 * This allows staff/admin users to modify a member's booking details.
 */
exports.updateBooking = async (req, res) => {
    console.log('DEBUG::updateBooking function called');
    try {
        console.log('DEBUG::Booking update attempt, ID:', req.params.id); // Log the ID
      const { id } = req.params;
      // Fetch the current booking first
      const currentBooking = await SessionBooking.findById(id);
      if (!currentBooking) {
        console.log('DEBUG::Booking not found:', id); // Log if booking not found
        return res.status(404).json({ message: 'Booking not found.' });
      }
      // Disallow modifications to cancelled bookings
       // Normalize the status string before checking
       console.log('DEBUG::Current booking status:', currentBooking.status);
    const status = currentBooking.status ? currentBooking.status.toLowerCase().trim() : '';
    if (status === 'cancelled') {
        console.log('DEBUG::Cancelled booking update attempt:', id); // Log if cancelled
      return res.status(400).json({ message: 'Cannot modify a cancelled booking.' });
    }
      
      // Build the updates object from req.body
      const updates = { ...req.body };
  
      // Process suiteAssignment if provided; if not provided, preserve current value.
      if (req.body.hasOwnProperty('suiteAssignment')) {
        if (
          !req.body.suiteAssignment ||
          req.body.suiteAssignment === '' ||
          !req.body.suiteAssignment.number
        ) {
          // Preserve the current assignment if no valid value is provided.
          updates.suiteAssignment = currentBooking.suiteAssignment;
        } else {
          // Convert the provided suite number to a number.
          const suiteNumber = Number(req.body.suiteAssignment.number);
          if (isNaN(suiteNumber)) {
            return res.status(400).json({ message: 'Invalid suite selection. Suite number must be numeric.' });
          }
          updates.suiteAssignment = {
            number: suiteNumber,
            // Use provided type or fallback to current booking's suite type or default based on sessionType.
            type: req.body.suiteAssignment.type || currentBooking.suiteAssignment?.type || (updates.sessionType === 'infrared' ? 'sauna' : 'redlight'),
            // Use provided handicap flag if available; otherwise preserve current.
            handicap: req.body.suiteAssignment.hasOwnProperty('handicap')
                        ? req.body.suiteAssignment.handicap
                        : currentBooking.suiteAssignment?.handicap || false,
          };
        }
      } else {
        // If no suiteAssignment field is provided, keep the current value.
        updates.suiteAssignment = currentBooking.suiteAssignment;
      }
  
      // Allow staff to update any other fields (appointmentDate, sessionType, extras, etc.)
      const updatedBooking = await SessionBooking.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );
      if (!updatedBooking) {
        return res.status(404).json({ message: 'Booking not found after update.' });
      }
      res.json({ message: 'Booking updated successfully!', booking: updatedBooking });
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ message: 'Server error updating booking.' });
    }
  };

  exports.cancelBooking = async (req, res) => {
    try {
      const booking = await SessionBooking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found.' });
      }
      booking.status = 'cancelled';
      booking.cancelledAt = new Date();
      await booking.save();
      res.json({ message: 'Booking cancelled successfully!', booking });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json({ message: 'Server error while cancelling booking.' });
    }
  };
  