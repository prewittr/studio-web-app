const Suite = require('../models/Suite');
const Booking = require('../models/SessionBooking');

// Helper: Round a date down to the start of the hour (for sauna sessions)
const getTimeBlock = (date) => {
  const blockStart = new Date(date);
  blockStart.setMinutes(0, 0, 0);
  const blockEnd = new Date(blockStart.getTime() + 60 * 60000);
  return { blockStart, blockEnd };
};

exports.getSaunaSuites = async (req, res) => {
  try {
    const { date, time } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required in YYYY-MM-DD format.' });
    }

    let blockStart, blockEnd;
    if (time) {
      const appointmentTime = new Date(time);
      ({ blockStart, blockEnd } = getTimeBlock(appointmentTime));
    } else {
      blockStart = new Date(date);
      blockStart.setHours(0, 0, 0, 0);
      blockEnd = new Date(date);
      blockEnd.setHours(23, 59, 59, 999);
    }
    console.log('Sauna Block Start:', blockStart, 'Block End:', blockEnd);

    // Fetch all suites of type 'sauna'
    const suites = await Suite.find({ type: 'sauna' });
    //console.log('Suites from DB:', suites);

    console.log('blockStart timestamp:', blockStart.getTime());
    console.log('blockEnd timestamp:', blockEnd.getTime());
    

    // Fetch bookings for infrared sessions (sauna) within the time block.
    const bookings = await Booking.find({
      sessionType: 'infrared',
      appointmentDate: { $gte: blockStart, $lt: blockEnd },
      status: { $ne: 'cancelled' }
    });

    bookings.forEach(b => {
        console.log('Booking timestamp:', new Date(b.appointmentDate).getTime());
      });
      

    console.log('Infrared bookings in block:', bookings);
    
    // Extract booked suite numbers from the suiteAssignment object.
    const bookedSuiteNumbers = bookings
      .map(b => b.suiteAssignment && b.suiteAssignment.number)
      .filter(num => num !== undefined && num !== null);
    
    //console.log('Sauna Block Start:', blockStart, 'Block End:', blockEnd);
   // console.log('All sauna suites:', suites);
    //console.log('Infrared bookings in block:', bookings);
    console.log('Booked suite numbers:', bookedSuiteNumbers);

    // Filter out suites that are already booked.
    const availableSuites = suites
      .filter(suite => !bookedSuiteNumbers.includes(suite.suiteNumber))
      .map(suite => ({
        id: suite.suiteNumber,
        name: suite.name
      }));

    res.json({ suites: availableSuites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching sauna suites' });
  }
};

exports.getRedlightSuites = async (req, res) => {
  try {
    const { date, time } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required in YYYY-MM-DD format.' });
    }

    let blockStart, blockEnd;
    if (time) {
      const appointmentTime = new Date(time);
      // Adjust to the nearest half-hour.
      const minutes = appointmentTime.getMinutes();
      appointmentTime.setMinutes(minutes < 30 ? 0 : 30, 0, 0);
      blockStart = new Date(appointmentTime);
      blockEnd = new Date(appointmentTime.getTime() + 30 * 60000);
    } else {
      blockStart = new Date(date);
      blockStart.setHours(0, 0, 0, 0);
      blockEnd = new Date(date);
      blockEnd.setHours(23, 59, 59, 999);
    }

    // Fetch all suites of type 'redlight'
    const suites = await Suite.find({ type: 'redlight' });

    // Fetch bookings for redlight sessions within the time block.
    const bookings = await Booking.find({
      sessionType: 'redlight',
      appointmentDate: { $gte: blockStart, $lt: blockEnd },
      status: { $ne: 'cancelled' }
    });

    // Extract booked suite numbers from suiteAssignment.
    const bookedSuiteNumbers = bookings
      .map(b => b.suiteAssignment && b.suiteAssignment.number)
      .filter(num => num !== undefined && num !== null);

    console.log('Redlight Block Start:', blockStart, 'Block End:', blockEnd);
    console.log('All redlight suites:', suites);
    console.log('Redlight bookings in block:', bookings);
    console.log('Booked suite numbers:', bookedSuiteNumbers);

    // Filter out suites that are booked.
    const availableSuites = suites
      .filter(suite => !bookedSuiteNumbers.includes(suite.suiteNumber))
      .map(suite => ({
        id: suite.suiteNumber,
        name: suite.name
      }));

    res.json({ suites: availableSuites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching red light bed suites' });
  }
};
