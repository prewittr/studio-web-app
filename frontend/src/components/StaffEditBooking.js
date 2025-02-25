import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './StaffEditBooking.css';

const StaffEditBooking = () => {
  const { id } = useParams(); // Booking ID from URL
  const navigate = useNavigate();
  const token = localStorage.getItem('jwtToken');

  // Local state for booking fields
  const [booking, setBooking] = useState(null);
  const [sessionType, setSessionType] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [suiteAssignment, setSuiteAssignment] = useState('');
  const [addGuest, setAddGuest] = useState(false);
  const [aromatherapy, setAromatherapy] = useState(false);
  const [halotherapy, setHalotherapy] = useState(false);
  const [availableSuites, setAvailableSuites] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/staff/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.booking) {
          const b = response.data.booking;
          setBooking(b);
          setSessionType(b.sessionType);
          setAppointmentDate(new Date(b.appointmentDate));
          setAddGuest(b.addGuest);
          setAromatherapy(b.aromatherapy);
          setHalotherapy(b.halotherapy);
          // Set the initial suite assignment as a string
          setSuiteAssignment(b.suiteAssignment ? b.suiteAssignment.number.toString() : '');
        } else {
          setError('No booking found.');
        }
      } catch (err) {
        console.error('Error fetching booking:', err.response ? err.response.data : err);
        setError(err.response?.data?.message || 'Error fetching booking details.');
      }
    };
    fetchBooking();
  }, [id, token]);

  // Update suiteAssignment when booking changes
  useEffect(() => {
    if (booking && booking.suiteAssignment) {
      setSuiteAssignment(booking.suiteAssignment.number.toString());
    }
  }, [booking]);

  // Fetch available suites when sessionType or appointmentDate changes
  useEffect(() => {
    const fetchSuites = async () => {
      if (!appointmentDate || !sessionType) return;
      try {
        const dateObj = new Date(appointmentDate);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        const endpoint =
          sessionType === 'infrared'
            ? '${process.env.REACT_APP_API_BASE_URL}/suites/sauna'
            : '${process.env.REACT_APP_API_BASE_URL}/suites/redlight';
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
          params: { date: dateString, time: appointmentDate.toISOString() }
        });
        let suites = response.data.suites || [];
        // Ensure the current booking's suite appears in the list
        if (booking && booking.suiteAssignment) {
          const currentSuiteNumber = booking.suiteAssignment.number;
          const found = suites.find(s => s.suiteNumber === currentSuiteNumber);
          if (!found) {
            suites.push({
              id: currentSuiteNumber,
              suiteNumber: currentSuiteNumber,
              name: booking.suiteAssignment.name || `Suite ${currentSuiteNumber}`
            });
          }
        }
        setAvailableSuites(suites);
      } catch (err) {
        console.error('Error fetching available suites:', err.response ? err.response.data : err);
        setAvailableSuites([]);
      }
    };
    fetchSuites();
  }, [sessionType, appointmentDate, token, booking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    // Prepare updated fields.
    const updates = {
      sessionType,
      appointmentDate: appointmentDate.toISOString(),
      suiteAssignment: {
        type: sessionType === 'infrared' ? 'sauna' : 'redlight',
        number: suiteAssignment !== '' ? Number(suiteAssignment) : null
      },
      addGuest,
      aromatherapy,
      halotherapy
    };

    // If suiteAssignment is null (or falsy), preserve the current assignment.
    if (updates.suiteAssignment.number === null) {
      updates.suiteAssignment = booking.suiteAssignment;
    }

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/staff/bookings/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message || 'Booking updated successfully!');
      setTimeout(() => navigate('/staff'), 1500);
    } catch (err) {
      console.error('Error updating booking:', err.response ? err.response.data : err);
      setError(err.response?.data?.message || 'Error updating booking.');
    }
  };

  const handleCancel = () => {
    navigate('/staff');
  };

  const handleCancelBooking = async () => {
    // Confirm cancellation
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/staff/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message || 'Booking cancelled successfully!');
      setTimeout(() => navigate('/staff'), 1500);
    } catch (err) {
      console.error('Error cancelling booking:', err.response ? err.response.data : err);
      setError(err.response?.data?.message || 'Error cancelling booking.');
    }
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }
  if (!booking) {
    return <p>Loading booking details...</p>;
  }

  return (
    <div className="staff-edit-booking">
      <h1>Edit Booking</h1>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      { !booking ? (
        <p>Loading booking details...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="sessionType">Session Type:</label>
            <select
              id="sessionType"
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
            >
              <option value="infrared">Infrared Sauna Session</option>
              <option value="redlight">Redlight Bed Session</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="appointmentDate">Appointment Date & Time:</label>
            <DatePicker
              id="appointmentDate"
              selected={appointmentDate}
              onChange={(date) => setAppointmentDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </div>
          <div className="form-group">
            <label htmlFor="suiteSelection">
              Select {sessionType === 'infrared' ? 'Sauna Suite' : 'Red Light Bed Suite'}:
            </label>
            <select
              id="suiteSelection"
              value={suiteAssignment}
              onChange={(e) => setSuiteAssignment(e.target.value)}
              required
            >
              <option value="">-- Select a Suite --</option>
              {availableSuites.map((suite) => (
                <option key={suite.id} value={suite.suiteNumber.toString()}>
                  {suite.name} (Suite {suite.suiteNumber})
                </option>
              ))}
            </select>
          </div>
          {sessionType === 'infrared' && (
            <>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="addGuest"
                    checked={addGuest}
                    onChange={(e) => setAddGuest(e.target.checked)}
                  /> Add Guest
                </label>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="aromatherapy"
                    checked={aromatherapy}
                    onChange={(e) => setAromatherapy(e.target.checked)}
                  /> Aromatherapy
                </label>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="halotherapy"
                    checked={halotherapy}
                    onChange={(e) => setHalotherapy(e.target.checked)}
                  /> Halotherapy
                </label>
              </div>
            </>
          )}
          <div className="form-actions">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="button" onClick={handleCancelBooking} className="cancel-booking-btn">
              Cancel Booking
            </button>
          </div>
        </form>
      )}
      </div>
  );
};

export default StaffEditBooking;
