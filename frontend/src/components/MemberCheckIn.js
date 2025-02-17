// MemberCheckIn.js
import React from 'react';
import axios from 'axios';
import './MemberCheckIn.css';

const MemberCheckIn = ({ bookingId }) => {
  const token = localStorage.getItem('jwtToken');

  const handleCheckIn = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/sessions/checkin',
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
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
