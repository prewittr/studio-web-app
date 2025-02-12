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
    return { startHour: 8, endHour: 20 };
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
      const { sessionType, appointmentDate, addGuest, aromatherapy, halotherapy } = req.body;
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
        return res.status(400).json({ message: 'Redlight bed sessions must be booked in quarter-hour increments.' });
      }
      
      // Ensure a member can only book one session of each type per day.
      const startOfDay = new Date(newStart);
      startOfDay.setHours(0,0,0,0);
      const endOfDay = new Date(newStart);
      endOfDay.setHours(23,59,59,999);
      
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
      // We use a query based on the standard overlap formula:
      // Two intervals [A,B) and [C,D) overlap if A < D and B > C.
      const overlappingOpposite = await SessionBooking.find({
        user: req.user.id,
        sessionType: { $ne: sessionType }, // opposite session type
        status: { $ne: 'cancelled' },
        appointmentDate: { $lt: newEnd }, // existing booking starts before newEnd
        // We'll use an $expr to compute existing booking's end time:
        $expr: { $gt: [ { $add: [ "$appointmentDate", { $multiply: ["$duration", 60000] } ] }, newStart ] }
      });
      
      if (overlappingOpposite.length > 0) {
        // For each overlapping booking, check the allowed offsets.
        for (let opp of overlappingOpposite) {
          const oppStart = new Date(opp.appointmentDate);
          const oppDuration = opp.duration; // expected to be 60 for sauna, 25 for redlight.
          const oppEnd = new Date(oppStart.getTime() + oppDuration * 60000);
          
          if (sessionType === 'redlight' && opp.sessionType === 'infrared') {
            // Allowed if the new redlight booking ends at least 30 minutes before the sauna starts,
            // or if it starts at least 60 minutes after the sauna starts.
            const allowedBefore = new Date(oppStart.getTime() - 30 * 60000);
            const allowedAfter = new Date(oppStart.getTime() + 60 * 60000);
            if (!(newEnd <= allowedBefore || newStart >= allowedAfter)) {
              return res.status(400).json({
                message: 'Your redlight session must end at least 30 minutes before or start at least 60 minutes after your sauna session.'
              });
            }
          } else if (sessionType === 'infrared' && opp.sessionType === 'redlight') {
            // For a new sauna booking overlapping an existing redlight, we simply disallow overlap.
            return res.status(400).json({
              message: 'You cannot book a sauna session that overlaps with an existing redlight session.'
            });
          }
        }
      }
      
      // Capacity checks based on the time block.
      const { blockStart, blockEnd } = getTimeBlock(newStart);
      let suiteAssignment = null;
      if (sessionType === 'redlight') {
  // For redlight sessions, capacity is 4 per hour (2 per redlight bed, one per half-hour segment).
  
  // Determine the half-hour segment for the new booking:
  // If the appointment minutes are less than 30, segment 1; otherwise, segment 2.
  const segment = newStart.getMinutes() < 30 ? 1 : 2;

  // Fetch all existing redlight bookings for this hour (time block)
  const existingRedlight = await SessionBooking.find({
    sessionType: 'redlight',
    status: { $ne: 'cancelled' },
    appointmentDate: { $gte: blockStart, $lt: blockEnd }
  });

  // For each redlight suite (number 1 and 2), count how many bookings are in the same segment.
  const assignedRed1 = existingRedlight.filter(b => {
    if (b.suiteAssignment && b.suiteAssignment.number === 1) {
      const bSegment = new Date(b.appointmentDate).getMinutes() < 30 ? 1 : 2;
      return bSegment === segment;
    }
    return false;
  }).length;
  
  const assignedRed2 = existingRedlight.filter(b => {
    if (b.suiteAssignment && b.suiteAssignment.number === 2) {
      const bSegment = new Date(b.appointmentDate).getMinutes() < 30 ? 1 : 2;
      return bSegment === segment;
    }
    return false;
  }).length;

  if (assignedRed1 < 1) {
    suiteAssignment = { type: 'redlight', number: 1 };
  } else if (assignedRed2 < 1) {
    suiteAssignment = { type: 'redlight', number: 2 };
  } else {
    return res.status(400).json({ 
      message: 'Redlight bed capacity for this hour has been reached for the selected half-hour segment.' 
    });
  }
}
else if (sessionType === 'infrared') {
        // For infrared, capacity is 8 per hour.
        if (req.user && req.user.handicap) {
          // Handicap users must get suite 4.
          const existingHandicap = await SessionBooking.findOne({
            sessionType: 'infrared',
            status: { $ne: 'cancelled' },
            'suiteAssignment.type': 'sauna',
            'suiteAssignment.number': 4,
            appointmentDate: { $gte: blockStart, $lt: blockEnd }
          });
          if (existingHandicap) {
            return res.status(400).json({ message: 'Handicap sauna capacity for this hour has been reached.' });
          }
          suiteAssignment = { type: 'sauna', number: 4, handicap: true };
        } else {
          // Non-handicap users use the pool [1,2,3,5,6,7,8].
          let availablePool = [1, 2, 3, 5, 6, 7, 8];
          const existingInfrared = await SessionBooking.find({
            sessionType: 'infrared',
            status: { $ne: 'cancelled' },
            appointmentDate: { $gte: blockStart, $lt: blockEnd }
          });
          existingInfrared.forEach(b => {
            if (b.suiteAssignment && b.suiteAssignment.type === 'sauna') {
              const num = b.suiteAssignment.number;
              availablePool = availablePool.filter(n => n !== num);
            }
          });
          if (availablePool.length === 0) {
            return res.status(400).json({ message: 'Infrared sauna capacity for this hour has been reached.' });
          }
          suiteAssignment = { type: 'sauna', number: availablePool[0] };
        }
      }
      
      // Create the booking with the computed suite assignment.
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
  
      // Optionally, you may want to verify that the session belongs to the current user.
      // For example:
      const session = await SessionBooking.findById(sessionId);
      if (!session || session.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this session.' });
       }
  
      // Update the session with new data. The { new: true } option returns the updated document.
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
  
  
// Function to fetch the member's bookings
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

  // Function to cancel sessions
  exports.cancelSession = async (req, res) => {
    try {
      const bookingId = req.params.id;
      const booking = await SessionBooking.findById(bookingId);
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
      // Calculate time difference in milliseconds
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

  // Function: Get all bookings (for staff)
  exports.getAllBookings = async (req, res) => {
    try {
      // Populate the "user" field to retrieve the username.
      const bookings = await SessionBooking.find({})
        .populate('user', 'username') // only bring the username field from the User document
        .sort({ appointmentDate: 1 });
      res.json({ bookings });
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      res.status(500).json({ message: 'Server error while fetching bookings.' });
    }
  };