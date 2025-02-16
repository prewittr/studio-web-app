import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MemberLanding.css';

const MemberLanding = () => {
  const [bookings, setBookings] = useState([]);
  const [membershipStatus, setMembershipStatus] = useState('Active');
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sessions'); // "sessions" or "profile"
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingSessionData, setEditingSessionData] = useState({});
  
  const token = localStorage.getItem('jwtToken');

  // Fetch booked sessions
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sessions/myBookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data.bookings);
        setMembershipStatus(response.data.membershipStatus || 'Active');
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    fetchBookings();
  }, [token]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // Session editing functions (same as before)
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

  // Use profile.username if available; fallback to "Member"
  const username = profile.username || 'Member';

  if (loading) {
    return <p className="loading-msg">Loading dashboard...</p>;
  }

  // Component for Booked Sessions Tab (rendering as list items)
  const SessionsTab = () => (
    <div className="sessions-tab">
      <div className="sessions-header">
        <h2>Booked Sessions</h2>
        <Link to="/book-session">
          <button className="book-btn">Book a Session</button>
        </Link>
      </div>
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
                  {new Date(booking.appointmentDate).toLocaleDateString('en-US')}{' '}
                  {new Date(booking.appointmentDate).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
                {booking.suiteAssignment && (
                  <p className="suite-info">
                    Suite: {booking.suiteAssignment.number}
                    {booking.suiteAssignment.handicap ? ' (ADA)' : ''}
                  </p>
                )}
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
                    <p className="non-editable-msg">No editable options available.</p>
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
                  <button
                    onClick={() => handleCancelSession(booking._id)}
                    className="cancel-btn"
                  >
                    Cancel Session
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-sessions-msg">You have no upcoming sessions.</p>
      )}
    </div>
  );

  // Component for Profile Information Tab
  const ProfileTab = () => (
    <div className="profile-tab">
      <h2>Profile Information</h2>
      <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Contact Number:</strong> {profile.contactNumber}</p>
      <p><strong>Membership Type:</strong> {profile.membershipType}</p>
      <p><strong>Membership Status:</strong> {profile.membershipStatus}</p>
      <Link to="/profile">
        <button className="edit-profile-btn">Edit Profile</button>
      </Link>
    </div>
  );

  return (
    <div className="member-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {username}!</h1>
          <p>Membership Status: <strong>{membershipStatus}</strong></p>
        </div>
      </header>

      <div className="tab-buttons">
        <button
          className={activeTab === 'sessions' ? 'active' : ''}
          onClick={() => setActiveTab('sessions')}
        >
          Booked Sessions
        </button>
        <button
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Profile Information
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'sessions' ? <SessionsTab /> : <ProfileTab />}
      </div>
    </div>
  );
};

export default MemberLanding;
