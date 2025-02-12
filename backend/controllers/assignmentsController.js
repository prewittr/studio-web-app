const SessionBooking = require('../models/SessionBooking');

// Define available suite pools.
const infraredNonHandicap = [
  { row: 1, number: 2 },
  { row: 1, number: 3 },
  { row: 1, number: 4 },
  { row: 2, number: 1 },
  { row: 2, number: 2 },
  { row: 2, number: 3 },
  { row: 2, number: 4 }
];
const redlightSuites = [
  { row: 1, number: 5 },
  { row: 2, number: 5 }
];

function isSuiteAssigned(suite, assignedSuites) {
  return assignedSuites.some(s => s.row === suite.row && s.number === suite.number);
}

function getRandomSuite(suites) {
  const index = Math.floor(Math.random() * suites.length);
  return suites[index];
}

// Endpoint to get suite assignments for a specific hour.
// Expects a query parameter 'time' (an ISO string for the starting hour).
exports.getSuiteAssignments = async (req, res) => {
  try {
    const { time } = req.query;
    if (!time) {
      return res.status(400).json({ message: 'Time query parameter is required.' });
    }
    const startTime = new Date(time);
    const endTime = new Date(startTime.getTime() + 60 * 60000); // one-hour block

    // Fetch bookings for that time block; populate user info (username and handicap).
    const bookings = await SessionBooking.find({
      appointmentDate: { $gte: startTime, $lt: endTime },
      status: 'booked'
    }).populate('user', 'username handicap'); // assuming User has a 'handicap' field

    const assignedSuites = []; // keep track of suites that are already assigned in this block.
    let bookingMap = {};
    // Loop through each booking and assign a suite if not already assigned.
    for (let booking of bookings) {
        if (!booking.suiteAssignment) {
          if (booking.sessionType === 'redlight') {
            if (availableRedlight.length > 0) {
              booking.suiteAssignment = availableRedlight.shift();
            }
          } else if (booking.sessionType === 'infrared') {
            if (booking.user && booking.user.handicap) {
              booking.suiteAssignment = { type: 'sauna', number: 4, handicap: true };
            } else {
              if (availableSauna.length > 0) {
                booking.suiteAssignment = availableSauna.shift();
              }
            }
          }
          if (booking.suiteAssignment) {
            await booking.save();  // Persist the assignment!
          }
        }
        // Build the mapping from suite key to booking(s)
        const key = `${booking.suiteAssignment.type}-${booking.suiteAssignment.number}`;
        if (booking.suiteAssignment.type === 'redlight') {
          if (!bookingMap[key]) {
            bookingMap[key] = [];
          }
          bookingMap[key].push(booking);
        } else {
          bookingMap[key] = booking;
        }
      }

    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching suite assignments:', error);
    res.status(500).json({ message: 'Server error while fetching suite assignments.' });
  }
};
