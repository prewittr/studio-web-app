import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import './BookSession.css';

const BookSession = () => {
  const [sessionType, setSessionType] = useState('infrared'); // default infrared
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableSuites, setAvailableSuites] = useState([]);
  const [selectedSuite, setSelectedSuite] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [addGuest, setAddGuest] = useState(false);
  const [aromatherapy, setAromatherapy] = useState(false);
  const [halotherapy, setHalotherapy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch available time slots when sessionType or selectedDay changes.
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        // Format selectedDay as YYYY-MM-DD
        const year = selectedDay.getFullYear();
        const month = String(selectedDay.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDay.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        console.log('Fetching availability for date:', dateString, 'and sessionType:', sessionType);
        const response = await axios.get('http://localhost:5000/api/sessions/availability', {
          headers: { Authorization: `Bearer ${token}` },
          params: { date: dateString, sessionType }
        });
        const slots = response.data.availableSlots.map((slot) => new Date(slot));
        setAvailableSlots(slots);
        // Reset selected slot if day or session type changes.
        setAppointmentDate(null);
      } catch (err) {
        console.error('Error fetching availability:', err.response ? err.response.data : err);
        setError(err.response?.data?.message || 'Error fetching availability');
      }
    };

    fetchAvailability();
  }, [sessionType, selectedDay]);

  // Automatically set the appointmentDate to the first available slot if not already set.
  useEffect(() => {
    if (availableSlots.length > 0 && !appointmentDate) {
      setAppointmentDate(availableSlots[0]);
    }
  }, [availableSlots, appointmentDate]);

  // Fetch available suites when sessionType, selectedDay, or appointmentDate changes.
  useEffect(() => {
    const fetchSuites = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const year = selectedDay.getFullYear();
        const month = String(selectedDay.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDay.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        // Pass appointmentDate (if selected) as the time parameter to narrow down the time block
        const timeParam = appointmentDate ? appointmentDate.toISOString() : undefined;
        const endpoint =
          sessionType === 'infrared'
            ? 'http://localhost:5000/api/suites/sauna'
            : 'http://localhost:5000/api/suites/redlight';
        console.log('Fetching suites with date:', dateString, 'time:', timeParam, 'for sessionType:', sessionType);
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
          params: { date: dateString, time: timeParam }
        });
        console.log('Suites response:', response.data);
        setAvailableSuites(response.data.suites || []);
        setSelectedSuite(''); // Reset suite selection when day/session changes
      } catch (err) {
        console.error('Error fetching available suites:', err.response ? err.response.data : err);
        setAvailableSuites([]);
      }
    };

    if (appointmentDate) {
      fetchSuites();
    }
  }, [sessionType, selectedDay, appointmentDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!appointmentDate) {
      setError('Please select a time slot.');
      return;
    }
    if (!selectedSuite) {
      setError('Please select an available suite.');
      return;
    }
    if (new Date(appointmentDate) < new Date()) {
      setError('The selected time is in the past. Please choose a future time slot.');
      return;
    }
      
    try {
      const token = localStorage.getItem('jwtToken');
      const bookingData = {
        sessionType,
        appointmentDate: appointmentDate.toISOString(),
        suite: selectedSuite,
        addGuest,
        aromatherapy,
        halotherapy
      };

      const response = await axios.post(
        'http://localhost:5000/api/sessions/book',
        bookingData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      setMessage(response.data.message || 'Session booked successfully!');
      setTimeout(() => navigate('/member'), 1500);
    } catch (err) {
      console.error('Error booking session:', err.response ? err.response.data : err);
      setError(err.response?.data?.message || 'Error booking session. Please try again.');
    }
  };

  const handleCancel = () => {
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
          onChange={(e) => {
            setSessionType(e.target.value);
            // Reset suite and slot selections when session type changes
            setAvailableSlots([]);
            setAvailableSuites([]);
            setAppointmentDate(null);
            setSelectedSuite('');
          }}
        >
          <option value="infrared">1 Hour Infrared Sauna Session</option>
          <option value="redlight">25 Min Red Light Bed Session</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="selectedDay">Select a Day:</label>
        <DatePicker
          id="selectedDay"
          selected={selectedDay}
          onChange={(date) => {
            setSelectedDay(date);
            setAppointmentDate(null);
            setSelectedSuite('');
          }}
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
                {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
              </button>
            ))
          ) : (
            <p>No available slots for this day.</p>
          )}
        </div>
      </div>

      {availableSuites.length > 0 ? (
        <div className="form-group">
          <label htmlFor="suiteSelection">
            Select {sessionType === 'infrared' ? 'Sauna Suite' : 'Red Light Bed Suite'}:
          </label>
          <select
            id="suiteSelection"
            value={selectedSuite}
            onChange={(e) => setSelectedSuite(e.target.value)}
            required
          >
            <option value="">-- Select a Suite --</option>
            {availableSuites.map((suite) => (
              <option key={suite.id} value={suite.suiteNumber}>
                {suite.name} (Suite {suite.suiteNumber})
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="form-group">
          <p>No available suites for this session type on this day.</p>
        </div>
      )}

      {appointmentDate && (
        <p>
          Selected Time:{' '}
          {appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
        </p>
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
