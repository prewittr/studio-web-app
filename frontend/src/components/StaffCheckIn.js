// StaffCheckIn.js
import React from 'react';
import axios from 'axios';
import './StaffCheckIn.css';

const StaffCheckIn = ({ bookingId, appointmentDate, refreshBookings }) => {
  const token = localStorage.getItem('jwtToken');
  const now = new Date();
  const appt = new Date(appointmentDate);
  // Allowed check-in time: 15 minutes before the appointment starts.
  const allowedCheckInTime = new Date(appt.getTime() - 15 * 60000);

  // Do not render the check-in button if it's too early.
  if (now < now) {
    return null;
  }

  const handleStaffCheckIn = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/staff/bookings/${bookingId}/checkin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      // Optionally refresh the bookings list if a callback is provided.
      if (refreshBookings) refreshBookings();
    } catch (error) {
      console.error('Error during staff check-in:', error.response ? error.response.data : error);
      alert(error.response?.data?.message || 'Error during staff check-in.');
    }
  };

  return (
    <button className="staff-checkin-btn" onClick={handleStaffCheckIn}>
      Check In
    </button>
  );
};

export default StaffCheckIn;
