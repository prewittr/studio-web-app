import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './StaffDashboard.css';

const StaffDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/staff/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data.bookings);
      } catch (error) {
        console.error('Error fetching all bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  // Helper function to format suite assignment.
  const formatSuiteAssignment = (assignment) => {
    if (!assignment) return 'Not Assigned';
    if (assignment.type === 'redlight') {
      return `Red Light Bed Suite ${assignment.number}`;
    } else if (assignment.type === 'sauna') {
      return assignment.handicap 
        ? `Handicap Suite ${assignment.number}` 
        : `Sauna Suite ${assignment.number}`;
    }
    return 'Not Assigned';
  };

  // Helper function to check if there are other bookings in the same suite/time block.
  const isBookingHighlighted = (booking, allBookings) => {
    if (!booking.suiteAssignment || !booking.appointmentDate) return false;
    const bookingTime = new Date(booking.appointmentDate);
    // For infrared sessions, define block as the hour block.
    // For redlight, define block as the 30-minute segment.
    const getBlockBoundaries = (date, type) => {
      const d = new Date(date);
      if (type === 'infrared') {
        d.setMinutes(0, 0, 0);
        return { blockStart: d, blockEnd: new Date(d.getTime() + 60 * 60000) };
      } else {
        // For redlight, round down to nearest half hour.
        const minutes = d.getMinutes();
        d.setMinutes(minutes < 30 ? 0 : 30, 0, 0);
        return { blockStart: d, blockEnd: new Date(d.getTime() + 30 * 60000) };
      }
    };

    const { blockStart, blockEnd } = getBlockBoundaries(bookingTime, booking.sessionType);

    // Check if at least one other booking in the list (with a different _id) has the same suite and falls in the same block.
    return allBookings.some(b => {
      if (b._id === booking._id || !b.suiteAssignment) return false;
      if (b.suiteAssignment.number !== booking.suiteAssignment.number) return false;
      const bTime = new Date(b.appointmentDate);
      return bTime >= blockStart && bTime < blockEnd;
    });
  };

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  return (
    <div className="staff-dashboard">
      <h1>Staff Dashboard</h1>
      
      <div className="dashboard-actions">
        <Link to="/suite-assignments">
          <button className="assignment-btn">View Suite Assignments</button>
        </Link>
      </div>
      
      <h2>All Bookings</h2>
      {bookings.length > 0 ? (
        <table className="booking-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Member</th>
              <th>Session Type</th>
              <th>Extras</th>
              <th>Status</th>
              <th>Assigned Suite</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const appointment = new Date(booking.appointmentDate);
              const dateString = appointment.toLocaleDateString('en-US');
              const timeString = appointment.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });
              const bookingStatus = booking.status.toLowerCase().trim();
              const highlight = isBookingHighlighted(booking, bookings);
              return (
                <tr key={booking._id} className={highlight ? 'highlight' : ''}>
                  <td>{dateString}</td>
                  <td>{timeString}</td>
                  <td>
                    {booking.user && booking.user.username
                      ? booking.user.username
                      : booking.user}
                  </td>
                  <td>
                    {booking.sessionType === 'infrared'
                      ? 'Infrared Sauna Session'
                      : 'Redlight Bed Session'}
                  </td>
                  <td>
                    {booking.sessionType === 'infrared' ? (
                      <>
                        {booking.addGuest && <span>Guest, </span>}
                        {booking.aromatherapy && <span>Aromatherapy, </span>}
                        {booking.halotherapy && <span>Halotherapy</span>}
                      </>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{booking.status}</td>
                  <td>{formatSuiteAssignment(booking.suiteAssignment)}</td>
                  <td>
                    {bookingStatus !== 'cancelled' && (
                      <Link to={`/staff/edit-booking/${booking._id}`}>
                        <button className="edit-btn">Edit Booking</button>
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No bookings available.</p>
      )}
    </div>
  );

  const checkedInBookings = bookings.filter(b => b.status.toLowerCase().trim() === 'checked-in');

return (
  <div className="staff-dashboard">
    <h1>Staff Dashboard</h1>
    
    {/* Existing dashboard actions... */}
    
    <h2>Active Check-Ins</h2>
    {checkedInBookings.length > 0 ? (
      <table className="booking-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Member</th>
            <th>Session Type</th>
            <th>Assigned Suite</th>
          </tr>
        </thead>
        <tbody>
          {checkedInBookings.map((booking) => {
            const appointment = new Date(booking.appointmentDate);
            const dateString = appointment.toLocaleDateString('en-US');
            const timeString = appointment.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            });
            return (
              <tr key={booking._id}>
                <td>{dateString}</td>
                <td>{timeString}</td>
                <td>{booking.user?.username || booking.user}</td>
                <td>{booking.sessionType === 'infrared' ? 'Infrared Sauna' : 'Redlight Bed'}</td>
                <td>{booking.suiteAssignment ? `Suite ${booking.suiteAssignment.number}` : 'Not Assigned'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    ) : (
      <p>No active check-ins.</p>
    )}
  </div>
);
};



export default StaffDashboard;
