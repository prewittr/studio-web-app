// backend/controllers/sessionsController.js
const SessionBooking = require('../models/SessionBooking');

// Helper to round a date down to the start of the hour.
const getTimeBlock = (date) => {
    const blockStart = new Date(date);
    blockStart.setMinutes(0, 0, 0);
    const blockEnd = new Date(blockStart.getTime() + 60 * 60000);
    return { blockStart, blockEnd };
  };

// Helper: Determine operating hours for a given date.
const getOperatingHours = (date) => {
  const day = date.getDay();
  // Weekends (Saturday=6, Sunday=0): 8am to 7pm.
  // Weekdays (Monday–Friday): 7am to 8pm.
  if (day === 0 || day === 6) {
    return { startHour: 7, endHour: 20 };
  } else {
    return { startHour: 7, endHour: 21 };
  }
};

// Helper: Generate potential time slots for a given day based on session type.
const generateTimeSlotsForDay = (day, sessionType) => {
  const slots = [];
  const { startHour, endHour } = getOperatingHours(day);
  let slotDuration, interval;
  if (sessionType === 'infrared') {
    slotDuration = 60; // minutes
    interval = 60;
  } else if (sessionType === 'redlight') {
    slotDuration = 25; // minutes
    interval = 30;
  } else {
    return slots;
  }
  let current = new Date(day);
  current.setHours(startHour, 0, 0, 0);
  const endTime = new Date(day);
  endTime.setHours(endHour, 0, 0, 0);
  const slotDurationMs = slotDuration * 60000;
  const lastValid = new Date(endTime.getTime() - slotDurationMs);
  while (current <= lastValid) {
    slots.push(new Date(current));
    current = new Date(current.getTime() + interval * 60000);
  }
  return slots;
};


exports.getAvailability = async (req, res) => {
    try {
      const { date, sessionType } = req.query;
      if (!date || !sessionType) {
        return res.status(400).json({ message: 'Date and sessionType are required as query parameters.' });
      }
      // Append a time component to ensure proper parsing
      const selectedDate = new Date(date + 'T00:00:00');
      if (isNaN(selectedDate)) {
        return res.status(400).json({ message: 'Invalid date format.' });
      }
      
      // Generate potential slots for the day
      const potentialSlots = generateTimeSlotsForDay(selectedDate, sessionType);
      const availableSlots = [];
      const now = new Date();
  
      // Determine if the selected date is today (by comparing only the date portion)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isToday = selectedDate.getTime() === today.getTime();
  
      // For each potential slot, check capacity and filter out past times if today
      for (const slot of potentialSlots) {
        // If the selected day is today, skip slots that are already in the past.
        if (isToday && slot < now) {
          continue;
        }
        
        if (sessionType === 'infrared') {
          // Infrared sessions: capacity is 8 per hour.
          const blockStart = new Date(slot);
          blockStart.setMinutes(0, 0, 0);
          const blockEnd = new Date(blockStart);
          blockEnd.setHours(blockEnd.getHours() + 1);
          const count = await SessionBooking.countDocuments({
            sessionType: 'infrared',
            appointmentDate: { $gte: blockStart, $lt: blockEnd }
          });
          if (count < 8) {
            availableSlots.push(slot);
          }
        } else if (sessionType === 'redlight') {
          // Redlight sessions: capacity is 2 per 30-minute block.
          const blockStart = new Date(slot);
          const minutes = blockStart.getMinutes();
          blockStart.setMinutes(minutes < 30 ? 0 : 30, 0, 0);
          const blockEnd = new Date(blockStart);
          blockEnd.setMinutes(blockEnd.getMinutes() + 30);
          const count = await SessionBooking.countDocuments({
            sessionType: 'redlight',
            appointmentDate: { $gte: blockStart, $lt: blockEnd }
          });
          if (count < 2) {
            availableSlots.push(slot);
          }
        }
      }
      res.json({ availableSlots });
    } catch (error) {
      console.error('Error fetching availability:', error);
      res.status(500).json({ message: 'Server error while fetching availability.' });
    }
  };

  // Function to book a session
 
  exports.bookSession = async (req, res) => {
    try {
      console.log("Booking payload:", req.body);
      const { sessionType, appointmentDate, addGuest, aromatherapy, halotherapy, suite } = req.body;
      if (!sessionType || !appointmentDate) {
        return res.status(400).json({ message: 'Session type and appointment date are required.' });
      }
      
      // Determine session duration in minutes.
      let duration;
      if (sessionType === 'infrared') {
        duration = 60;
      } else if (sessionType === 'redlight') {
        duration = 25;
      } else {
        return res.status(400).json({ message: 'Invalid session type.' });
      }
      
      const newStart = new Date(appointmentDate);
      const newEnd = new Date(newStart.getTime() + duration * 60000);
      const now = new Date();
      if (newStart <= now) {
        return res.status(400).json({ message: 'Cannot book a session in the past.' });
      }
      
      // Validate time increments.
      if (sessionType === 'infrared' && newStart.getMinutes() !== 0) {
        return res.status(400).json({ message: 'Infrared sauna sessions must be booked on the hour.' });
      }
      if (sessionType === 'redlight' && (newStart.getMinutes() % 15 !== 0)) {
        return res.status(400).json({ message: 'Red light bed sessions must be booked in quarter-hour increments.' });
      }
      
      // Ensure a member can only book one session of each type per day.
      const startOfDay = new Date(newStart);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(newStart);
      endOfDay.setHours(23, 59, 59, 999);
      
      const existingDailyBooking = await SessionBooking.findOne({
        user: req.user.id,
        sessionType: sessionType,
        status: { $ne: 'cancelled' },
        appointmentDate: { $gte: startOfDay, $lte: endOfDay }
      });
      if (existingDailyBooking) {
        return res.status(400).json({ message: `You have already booked a ${sessionType} session on this day.` });
      }
      
      // Check for overlapping bookings of the opposite type.
      const overlappingOpposite = await SessionBooking.find({
        user: req.user.id,
        sessionType: { $ne: sessionType },
        status: { $ne: 'cancelled' },
        appointmentDate: { $lt: newEnd },
        $expr: { $gt: [ { $add: [ "$appointmentDate", { $multiply: ["$duration", 60000] } ] }, newStart ] }
      });
      if (overlappingOpposite.length > 0) {
        for (let opp of overlappingOpposite) {
          const oppStart = new Date(opp.appointmentDate);
          const oppDuration = opp.duration;
          const oppEnd = new Date(oppStart.getTime() + oppDuration * 60000);
          if (sessionType === 'redlight' && opp.sessionType === 'infrared') {
            const allowedBefore = new Date(oppStart.getTime() - 30 * 60000);
            const allowedAfter = new Date(oppStart.getTime() + 60 * 60000);
            if (!(newEnd <= allowedBefore || newStart >= allowedAfter)) {
              return res.status(400).json({
                message: 'Your redlight session must end at least 30 minutes before or start at least 60 minutes after your sauna session.'
              });
            }
          } else if (sessionType === 'infrared' && opp.sessionType === 'redlight') {
            return res.status(400).json({
              message: 'You cannot book a sauna session that overlaps with an existing redlight session.'
            });
          }
        }
      }
      
      // Determine suite assignment.
      let suiteAssignment = null;
      if (suite) {
        // Convert the provided suite to a number
        const suiteNumber = Number(suite);
        if (isNaN(suiteNumber)) {
          return res.status(400).json({ message: 'Invalid suite selection. Suite number must be numeric.' });
        }
        // Check if the selected suite is already booked during this time slot.
        const existingSuiteBooking = await SessionBooking.findOne({
          'suiteAssignment.type': sessionType === 'infrared' ? 'sauna' : 'redlight',
          'suiteAssignment.number': suiteNumber,
          appointmentDate: { $gte: newStart, $lt: newEnd },
          status: { $ne: 'cancelled' }
        });
        if (existingSuiteBooking) {
          return res.status(400).json({ message: 'Selected suite is already booked for the chosen time slot. Please choose another suite or time slot.' });
        }
        suiteAssignment = { type: sessionType === 'infrared' ? 'sauna' : 'redlight', number: suiteNumber };
      } else {
        // Automatic suite assignment logic here...
        // (Assuming you have the logic to automatically assign suites if none is selected.)
        // For brevity, this example doesn't include the automatic assignment.
        return res.status(400).json({ message: 'No suite selected. Please choose a suite.' });
      }
        
      // Create the booking.
      const booking = new SessionBooking({
        user: req.user.id,
        sessionType,
        appointmentDate: newStart,
        addGuest: sessionType === 'infrared' ? Boolean(addGuest) : false,
        aromatherapy: sessionType === 'infrared' ? Boolean(aromatherapy) : false,
        halotherapy: sessionType === 'infrared' ? Boolean(halotherapy) : false,
        duration,
        status: 'booked',
        suiteAssignment
      });
        
      await booking.save();
      res.status(201).json({ message: 'Session booked successfully!', booking });
    } catch (error) {
      console.error('Error booking session:', error);
      res.status(500).json({ message: 'Server error while booking session.' });
    }
  };  
  
  exports.updateSession = async (req, res) => {
    try {
      const sessionId = req.params.id;
      const updates = req.body; // Expecting an object with fields like { addGuest, aromatherapy, halotherapy }
    
      // Determine the role of the requester.
    // Assuming req.user is populated and contains a 'role' property.
    const userRole = req.user.role; 

    let session;
    if (userRole === 'staff' || userRole === 'admin') {
      // Allow staff or admin to update any session.
      session = await SessionBooking.findById(sessionId);
    } else {
      // Regular members can only update their own sessions.
      session = await SessionBooking.findOne({ _id: sessionId, user: req.user.id });
    }
    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }
    
      const updatedSession = await SessionBooking.findByIdAndUpdate(
        sessionId,
        updates,
        { new: true, runValidators: true }
      );
    
      if (!updatedSession) {
        return res.status(404).json({ message: 'Session not found.' });
      }
    
      res.json({
        message: 'Session updated successfully!',
        updatedSession,
      });
    } catch (error) {
      console.error('Error updating session:', error);
      res.status(500).json({ message: 'Server error updating session.' });
    }
  };
    
  exports.getMyBookings = async (req, res) => {
    try {
      const bookings = await SessionBooking.find({
        user: req.user.id,
        status: 'booked'
      }).sort({ appointmentDate: 1 });
      res.json({ bookings, membershipStatus: "Active" });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Server error while fetching bookings." });
    }
  };
  
  exports.cancelSession = async (req, res) => {
    try {
      const bookingId = req.params.id;
          
    let booking;
    // Allow staff or admin to cancel any booking; members can cancel only their own.
    if (req.user.role === 'staff' || req.user.role === 'admin') {
      booking = await SessionBooking.findById(bookingId);
    } else {
      booking = await SessionBooking.findOne({ _id: bookingId, user: req.user.id });
    }     
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found.' });
      }
      if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to cancel this booking.' });
      }
      const now = new Date();
      if (booking.appointmentDate < now) {
        return res.status(400).json({ message: 'Cannot cancel a session that has already started or passed.' });
      }
      const timeDiffMs = booking.appointmentDate.getTime() - now.getTime();
      const twoHoursMs = 2 * 60 * 60 * 1000;
      let warningMessage = '';
      if (timeDiffMs < twoHoursMs) {
        warningMessage = 'Warning: Cancellation less than 2 hours prior will incur a cancellation fee.';
        booking.cancellationFeeApplied = true;
      }
      booking.status = 'cancelled';
      booking.cancelledAt = now;
      await booking.save();
      res.status(200).json({ message: `Session cancelled successfully. ${warningMessage}` });
    } catch (error) {
      console.error('Error cancelling session:', error);
      res.status(500).json({ message: 'Server error while cancelling session.' });
    }
  };
  
  exports.getAllBookings = async (req, res) => {
    try {
      const bookings = await SessionBooking.find({})
        .populate('user', 'username')
        .sort({ appointmentDate: 1 });
      res.json({ bookings });
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      res.status(500).json({ message: 'Server error while fetching bookings.' });
    }
  };

  // backend/controllers/sessionsController.js
exports.checkInBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required.' });
    }

    // Find the booking (ensure it belongs to the logged in member)
    const booking = await SessionBooking.findOne({
      _id: bookingId,
      user: req.user.id,
      status: 'booked'  // only allow check-in for active bookings
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or cannot be checked in.' });
    }

    // Update the booking status to "checked-in"
    booking.status = 'checked-in';
    booking.checkedInAt = new Date();
    await booking.save();

    res.json({ message: 'Successfully checked in!', booking });
  } catch (error) {
    console.error('Error checking in booking:', error);
    res.status(500).json({ message: 'Server error while checking in.' });
  }
};


