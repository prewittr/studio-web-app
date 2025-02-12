import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './MemberLanding.css';

const MemberLanding = () => {
  const [bookings, setBookings] = useState([]);
  const [membershipStatus, setMembershipStatus] = useState('Active');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('jwtToken');

  // Fetch active (booked) sessions from the backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sessions/myBookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched bookings:", response.data.bookings);
        setBookings(response.data.bookings);
        setMembershipStatus(response.data.membershipStatus || 'Active');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  // Cancel a booking after confirmation
  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this session? Cancellations less than 2 hours before the session may incur a fee."
    );
    if (!confirmCancel) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/sessions/${bookingId}/cancel`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(response.data.message);
      // Refresh bookings by filtering out the cancelled booking.
      setBookings(bookings.filter((b) => b._id !== bookingId));
    } catch (error) {
      console.error('Error cancelling booking:', error.response ? error.response.data : error);
      alert(error.response?.data?.message || 'Error cancelling session.');
    }
  };

  // Decode token to get username (optional)
  let username = 'Member';
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      username = payload.username || 'Member';
    } catch (e) {
      console.error('Error decoding token', e);
    }
  }

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="member-dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {username}!</h1>
        <p>Membership Status: <strong>{membershipStatus}</strong></p>
        <nav className="dashboard-nav">
          <Link to="/profile" className="profile-link">My Profile</Link>
        </nav>
      </header>

      <div className="dashboard-actions">
        <Link to="/book-session">
          <button className="book-btn">Book a New Session</button>
        </Link>
      </div>

      <h2>Upcoming Sessions</h2>
      {bookings.length > 0 ? (
        <ul className="session-list">
          {bookings.map((booking) => (
            <li key={booking._id} className="session-item">
              <p className="session-type">
                {booking.sessionType === 'infrared'
                  ? 'Infrared Sauna Session'
                  : 'Redlight Bed Session'}
              </p>
              <p className="session-date">
                Date: {new Date(booking.appointmentDate).toLocaleString()}
              </p>
              {booking.sessionType === 'infrared' && (
                <div className="session-extras">
                  <p>Add Guest: {booking.addGuest ? 'Yes' : 'No'}</p>
                  <p>Aromatherapy: {booking.aromatherapy ? 'Yes' : 'No'}</p>
                  <p>Halotherapy: {booking.halotherapy ? 'Yes' : 'No'}</p>
                </div>
              )}
              <button className="cancel-btn" onClick={() => handleCancel(booking._id)}>
                Cancel Session
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no upcoming sessions.</p>
      )}
    </div>
  );
};

export default MemberLanding;
