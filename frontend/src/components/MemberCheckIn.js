// MemberCheckIn.js
import React from 'react';
import axios from 'axios';
import './MemberCheckIn.css';

const MemberCheckIn = ({ bookingId, appointmentDate }) => {
  const token = localStorage.getItem('jwtToken');
  const now = new Date();
  const appt = new Date(appointmentDate);
  // Calculate the allowed check-in time: 15 minutes before the appointment
  const allowedCheckInTime = new Date(appt.getTime() - 15 * 60000);

  // If current time is before allowed check-in time, don't render the button at all.
  if (now < allowedCheckInTime) {
    return null;
  }

  const handleCheckIn = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/sessions/checkin',
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      // Optionally refresh the page or update state here.
    } catch (error) {
      console.error('Error during check-in:', error.response ? error.response.data : error);
      alert(error.response?.data?.message || 'Error during check-in.');
    }
  };

  return (
    <button className="checkin-btn" onClick={handleCheckIn}>
      Check In
    </button>
  );
};

export default MemberCheckIn;
