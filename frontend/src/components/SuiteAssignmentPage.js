import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './SuiteAssignmentPage.css';

const SuiteAssignmentPage = () => {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        // Round selectedDateTime to the start of the hour.
        const blockStart = new Date(selectedDateTime);
        blockStart.setMinutes(0, 0, 0);
        const response = await axios.get('http://localhost:5000/api/assignments/assignments', {
          headers: { Authorization: `Bearer ${token}` },
          params: { time: blockStart.toISOString() }
        });
        setBookings(response.data.bookings);
        setError('');
      } catch (err) {
        console.error('Error fetching assignments:', err.response ? err.response.data : err);
        setError(err.response?.data?.message || 'Error fetching assignments.');
      }
    };
    fetchAssignments();
  }, [selectedDateTime, token]);

  // Define the suite layout:
  // Column 1: Top cell is Redlight 1, then Sauna 1, Sauna 2, Sauna 3, then Handicap (Sauna 4).
  // Column 2: Top cell is Redlight 2, then Sauna 5, Sauna 6, Sauna 7, Sauna 8.
  const layout = {
    column1: [
      { type: 'redlight', number: 1 },
      { type: 'sauna', number: 4 },
      { type: 'sauna', number: 3 },
      { type: 'sauna', number: 2 },
      { type: 'sauna', number: 1, handicap: true }
    ],
    column2: [
      { type: 'redlight', number: 2 },
      { type: 'sauna', number: 8 },
      { type: 'sauna', number: 7 },
      { type: 'sauna', number: 6 },
      { type: 'sauna', number: 5 }
    ]
  };

  // Build a mapping from suite key to booking(s)
  // For redlight suites, we accumulate bookings in an array.
  const bookingMap = {};

  bookings.forEach((booking) => {
    if (booking.suiteAssignment && booking.suiteAssignment.type && booking.suiteAssignment.number) {
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
  });

  // Sort redlight bookings chronologically for each redlight suite.
  Object.keys(bookingMap).forEach((key) => {
    if (key.startsWith('redlight-') && Array.isArray(bookingMap[key])) {
      bookingMap[key].sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
    }
  });

  // Helper: Format a booking's appointment time.
  const formatTime = (booking) => {
    return new Date(booking.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="suite-assignment-page">
      <h1>Suite Assignments</h1>
      <div className="time-picker">
        <label>Select Date & Time:</label>
        <DatePicker
          selected={selectedDateTime}
          onChange={(date) => setSelectedDateTime(date)}
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
          minDate={new Date()}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      
      <div className="assignment-grid">
        {/* Column 1 */}
        <div className="column">
          {layout.column1.map((suite, idx) => {
            const key = `${suite.type}-${suite.number}`;
            const booking = bookingMap[key];
            return (
              <div key={idx} className={`suite-cell ${suite.handicap ? 'handicap' : ''}`}>
                <div className="suite-header">
                  {suite.type === 'redlight'
                    ? `Redlight ${suite.number}`
                    : suite.handicap
                      ? 'ADA'
                      : `Sauna ${suite.number}`}
                </div>
                <div className="suite-content">
                  {suite.type === 'redlight' ? (
                    booking && Array.isArray(booking) && booking.length > 0 ? (
                      booking.map((b, i) => (
                        <div key={i}>
                          {b.user && b.user.username} {formatTime(b)}
                        </div>
                      ))
                    ) : (
                      'Available'
                    )
                  ) : (
                    booking && booking.user && booking.user.username ? booking.user.username : 'Available'
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Hallway */}
        <div className="hallway">Hallway</div>
        {/* Column 2 */}
        <div className="column">
          {layout.column2.map((suite, idx) => {
            const key = `${suite.type}-${suite.number}`;
            const booking = bookingMap[key];
            return (
              <div key={idx} className="suite-cell">
                <div className="suite-header">
                  {suite.type === 'redlight'
                    ? `Redlight ${suite.number}`
                    : `Sauna ${suite.number}`}
                </div>
                <div className="suite-content">
                  {suite.type === 'redlight' ? (
                    booking && Array.isArray(booking) && booking.length > 0 ? (
                      booking.map((b, i) => (
                        <div key={i}>
                          {b.user && b.user.username} {formatTime(b)}
                        </div>
                      ))
                    ) : (
                      'Available'
                    )
                  ) : (
                    booking && booking.user && booking.user.username ? booking.user.username : 'Available'
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SuiteAssignmentPage;
