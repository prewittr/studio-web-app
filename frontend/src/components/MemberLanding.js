import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './MemberLanding.css';

const MemberLanding = () => {
  const [bookings, setBookings] = useState([]);
  const [membershipStatus, setMembershipStatus] = useState('Active');
  const [loading, setLoading] = useState(true);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingSessionData, setEditingSessionData] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('jwtToken');

  // Fetch active sessions from the backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sessions/myBookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  const handleCancelSession = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this session? Cancellations less than 2 hours before the session may incur a fee."
    );
    if (!confirmCancel) return;
    try {
      const response = await axios.delete(`http://localhost:5000/api/sessions/${bookingId}/cancel`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(response.data.message);
      setBookings(bookings.filter((b) => b._id !== bookingId));
      if (editingSessionId === bookingId) {
        setEditingSessionId(null);
        setEditingSessionData({});
      }
    } catch (error) {
      console.error('Error cancelling session:', error.response ? error.response.data : error);
      alert(error.response?.data?.message || 'Error cancelling session.');
    }
  };

  const handleEditSession = (booking) => {
    setEditingSessionId(booking._id);
    if (booking.sessionType === 'infrared') {
      setEditingSessionData({
        addGuest: booking.addGuest || false,
        aromatherapy: booking.aromatherapy || false,
        halotherapy: booking.halotherapy || false,
      });
    } else {
      setEditingSessionData({});
    }
  };

  const handleEditChange = (e) => {
    const { name, checked } = e.target;
    setEditingSessionData({ ...editingSessionData, [name]: checked });
  };

  const handleSaveChanges = async (bookingId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/sessions/${bookingId}`, editingSessionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(response.data.message || 'Session updated successfully!');
      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId ? { ...booking, ...editingSessionData } : booking
        )
      );
      setEditingSessionId(null);
      setEditingSessionData({});
    } catch (error) {
      console.error('Error updating session:', error.response ? error.response.data : error);
      alert(error.response?.data?.message || 'Failed to update session.');
    }
  };

  const handleCancelEditing = () => {
    setEditingSessionId(null);
    setEditingSessionData({});
  };

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
    return <p className="loading-msg">Loading dashboard...</p>;
  }

  return (
    <div className="member-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {username}!</h1>
          <p>Membership Status: <strong>{membershipStatus}</strong></p>
          <nav className="dashboard-nav">
            <Link to="/profile" className="profile-link">My Profile</Link>
          </nav>
        </div>
      </header>

      <div className="dashboard-actions">
        <Link to="/book-session">
          <button className="book-btn">Book a New Session</button>
        </Link>
      </div>

      <section className="sessions-section">
        <h2>Upcoming Sessions</h2>
        {bookings.length > 0 ? (
          <ul className="session-list">
            {bookings.map((booking) => (
              <li key={booking._id} className="session-item">
                <div className="session-info">
                  <p className="session-type">
                    {booking.sessionType === 'infrared'
                      ? 'Infrared Sauna Session'
                      : 'Redlight Bed Session'}
                  </p>
                  <p className="session-date">
                    {new Date(booking.appointmentDate).toLocaleString()}
                  </p>
                  {booking.sessionType === 'infrared' && editingSessionId !== booking._id && (
                    <div className="session-extras">
                      <p>Add Guest: {booking.addGuest ? 'Yes' : 'No'}</p>
                      <p>Aromatherapy: {booking.aromatherapy ? 'Yes' : 'No'}</p>
                      <p>Halotherapy: {booking.halotherapy ? 'Yes' : 'No'}</p>
                    </div>
                  )}
                </div>
                {editingSessionId === booking._id ? (
                  <div className="edit-session-form">
                    {booking.sessionType === 'infrared' ? (
                      <>
                        <label>
                          <input
                            type="checkbox"
                            name="addGuest"
                            checked={editingSessionData.addGuest || false}
                            onChange={handleEditChange}
                          /> Add Guest
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            name="aromatherapy"
                            checked={editingSessionData.aromatherapy || false}
                            onChange={handleEditChange}
                          /> Aromatherapy
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            name="halotherapy"
                            checked={editingSessionData.halotherapy || false}
                            onChange={handleEditChange}
                          /> Halotherapy
                        </label>
                      </>
                    ) : (
                      <p className="non-editable-msg">No options to edit.</p>
                    )}
                    <div className="edit-buttons">
                      {booking.sessionType === 'infrared' && (
                        <button
                          onClick={() => handleSaveChanges(booking._id)}
                          className="save-edit-btn"
                          type="button"
                        >
                          Save Changes
                        </button>
                      )}
                      <button
                        onClick={handleCancelEditing}
                        className="cancel-edit-btn"
                        type="button"
                      >
                        Cancel Editing
                      </button>
                      <button
                        onClick={() => handleCancelSession(booking._id)}
                        className="cancel-session-btn"
                        type="button"
                      >
                        Cancel Session
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="session-actions">
                    <button
                      onClick={() => handleEditSession(booking)}
                      className="edit-btn"
                    >
                      Edit Session
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-sessions-msg">You have no upcoming sessions.</p>
        )}
      </section>
    </div>
  );
};

export default MemberLanding;
