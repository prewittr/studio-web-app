const Booking = require('../models/Booking');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { appointmentDate } = req.body;
    if (!appointmentDate) {
      return res.status(400).json({ message: 'Appointment date is required.' });
    }

    const newBooking = new Booking({
      user: req.user.id, // from the authenticateJWT middleware
      appointmentDate,
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully.', booking: newBooking });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error while creating booking.' });
  }
};

// Retrieve bookings for the logged-in user
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id });
    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error while retrieving bookings.' });
  }
};

// Update an existing booking
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentDate, status } = req.body;

    // Find the booking by ID
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    // Ensure that the logged-in user is the owner of the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this booking.' });
    }

    // Update the appointmentDate if provided
    if (appointmentDate) {
      booking.appointmentDate = appointmentDate;
    }
    
    // Optionally update the status if provided (e.g., to confirm the booking)
    if (status && ['pending', 'confirmed', 'cancelled'].includes(status)) {
      booking.status = status;
    }

    await booking.save();
    res.json({ message: 'Booking updated successfully.', booking });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error while updating booking.' });
  }
};
// Cancel a booking (set its status to 'cancelled')
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the booking by ID
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    // Ensure that the logged-in user is the owner of the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking.' });
    }

    // Update the status to 'cancelled'
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully.', booking });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error while cancelling booking.' });
  }
};
