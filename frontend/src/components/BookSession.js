import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import './BookSession.css';

// Helper functions (getOperatingHours and generateTimeSlotsForDay)
const getOperatingHours = (date) => {
  const day = date.getDay();
  // Weekends: 8am to 7pm, Weekdays: 7am to 8pm
  if (day === 0 || day === 6) {
    return { startHour: 8, endHour: 19 };
  } else {
    return { startHour: 7, endHour: 20 };
  }
};

/*const generateTimeSlotsForDay = (day, sessionType) => {
  const slots = [];
  const { startHour, endHour } = getOperatingHours(day);
  let slotDuration, interval;
  if (sessionType === 'infrared') {
    slotDuration = 60;
    interval = 60;
  } else if (sessionType === 'redlight') {
    slotDuration = 25;
    interval = 15;
  } else {
    return slots;
  }
  let current = new Date(day);
  current.setHours(startHour, 0, 0, 0);
  const endTime = new Date(day);
  endTime.setHours(endHour, 0, 0, 0);
  const slotDurationMs = slotDuration * 60000;
  const lastValid = new Date(endTime.getTime() - slotDurationMs);
  while (current <= lastValid) {
    slots.push(new Date(current));
    current = new Date(current.getTime() + interval * 60000);
  }
  return slots;
};*/

const BookSession = () => {
  const [sessionType, setSessionType] = useState('infrared'); // default infrared
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [addGuest, setAddGuest] = useState(false);
  const [aromatherapy, setAromatherapy] = useState(false);
  const [halotherapy, setHalotherapy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch available slots when sessionType or selectedDay changes.
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        // Format selectedDay as YYYY-MM-DD
        const year = selectedDay.getFullYear();
        const month = String(selectedDay.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDay.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        const response = await axios.get('http://localhost:5000/api/sessions/availability', {
          headers: { Authorization: `Bearer ${token}` },
          params: { date: dateString, sessionType }
        });
        const slots = response.data.availableSlots.map((slot) => new Date(slot));
        setAvailableSlots(slots);
        setAppointmentDate(null); // Reset selected slot when day/session changes
      } catch (err) {
        console.error('Error fetching availability:', err.response ? err.response.data : err);
        setError(err.response?.data?.message || 'Error fetching availability');
      }
    };

    fetchAvailability();
  }, [sessionType, selectedDay]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!appointmentDate) {
      setError('Please select a time slot.');
      return;
    }

    // Extra front-end validation: ensure the selected appointment is in the future.
    if (new Date(appointmentDate) < new Date()) {
        setError('The selected time is in the past. Please choose a future time slot.');
        return;
      }
      
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post(
        'http://localhost:5000/api/sessions/book',
        {
          sessionType,
          appointmentDate: appointmentDate.toISOString(),
          addGuest,
          aromatherapy,
          halotherapy
        },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      setMessage(response.data.message || 'Session booked successfully!');
      setTimeout(() => navigate('/member'), 1500);
    } catch (err) {
      console.error('Error booking session:', err.response ? err.response.data : err);
      setError(err.response?.data?.message || 'Error booking session. Please try again.');
    }
  };

  // Cancel the booking process and navigate back to the member dashboard.
  const handleCancel = () => {
    // Optionally, reset any temporary state here
    navigate('/member');
  };

  return (
    <div className="book-session">
      <h2>Book a Session</h2>
      
      <div className="form-group">
        <label htmlFor="sessionType">Session Type:</label>
        <select
          id="sessionType"
          value={sessionType}
          onChange={(e) => setSessionType(e.target.value)}
        >
          <option value="infrared">1 Hour Infrared Sauna Session</option>
          <option value="redlight">25 Min Redlight Bed Session</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="selectedDay">Select a Day:</label>
        <DatePicker
          id="selectedDay"
          selected={selectedDay}
          onChange={(date) => setSelectedDay(date)}
          dateFormat="MMMM d, yyyy"
          minDate={new Date()}
        />
      </div>

      <div className="available-slots">
        <h3>
          Available Time Slots for {selectedDay.toLocaleDateString()}{' '}
          <span className="slot-count">({availableSlots.length} available)</span>
        </h3>
        <div className="slots-container">
          {availableSlots.length > 0 ? (
            availableSlots.map((slot, index) => (
              <button
                type="button"
                key={index}
                className={`slot-btn ${
                  appointmentDate && slot.getTime() === appointmentDate.getTime() ? 'selected' : ''
                }`}
                onClick={() => setAppointmentDate(slot)}
              >
                {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </button>
            ))
          ) : (
            <p>No available slots for this day.</p>
          )}
        </div>
      </div>

      {appointmentDate && (
        <p>Selected Time: {appointmentDate.toLocaleString()}</p>
      )}

      {sessionType === 'infrared' && (
        <>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={addGuest}
                onChange={(e) => setAddGuest(e.target.checked)}
              />
              Add a Guest
            </label>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={aromatherapy}
                onChange={(e) => setAromatherapy(e.target.checked)}
              />
              Add Aromatherapy
            </label>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={halotherapy}
                onChange={(e) => setHalotherapy(e.target.checked)}
              />
              Add Halo Therapy
            </label>
          </div>
        </>
      )}

      <div className="form-actions">
        <button type="submit" onClick={handleSubmit}>
          Book Session
        </button>
        <button type="button" onClick={handleCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
      
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default BookSession;
