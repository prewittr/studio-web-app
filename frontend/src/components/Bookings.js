import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [message, setMessage] = useState('');
  
  // Retrieve token from localStorage (or use a state management solution)
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data.bookings);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      }
    };

    fetchBookings();
  }, [token]);

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        { appointmentDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      // Refresh bookings list after creation
      setBookings([...bookings, response.data.booking]);
    } catch (err) {
      console.error('Error creating booking:', err);
      setMessage('Error creating booking.');
    }
  };

  return (
    <div>
      <h2>Your Bookings</h2>
      {message && <p>{message}</p>}
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id}>
            {new Date(booking.appointmentDate).toLocaleString()} - {booking.status}
          </li>
        ))}
      </ul>
      <h3>Create a Booking</h3>
      <form onSubmit={handleCreateBooking}>
        <div>
          <label>Appointment Date:</label>
          <input 
            type="datetime-local"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required 
          />
        </div>
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
}

export default Bookings;
