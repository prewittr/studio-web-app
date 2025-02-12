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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching all bookings:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  // Helper function to format the suite assignment.
  const formatSuiteAssignment = (assignment) => {
    if (!assignment) return 'Not Assigned';
    if (assignment.type === 'redlight') {
      return `Redlight ${assignment.number}`;
    } else if (assignment.type === 'sauna') {
      if (assignment.handicap) {
        return 'Handicap';
      }
      return `Sauna ${assignment.number}`;
    }
    return 'Not Assigned';
  };

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  return (
    <div className="staff-dashboard">
      <h1>Staff Dashboard</h1>
      
      {/* Add a link to the suite assignments page */}
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
              <th>Time</th>
              <th>Member</th>
              <th>Session Type</th>
              <th>Extras</th>
              <th>Status</th>
              <th>Assigned Suite</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{new Date(booking.appointmentDate).toLocaleString()}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No bookings available.</p>
      )}
    </div>
  );
};

export default StaffDashboard;
