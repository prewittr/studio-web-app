import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import StaffCheckIn from './StaffCheckIn';
import 'react-datepicker/dist/react-datepicker.css';
import './StaffDashboard.css';

const StaffDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // For tab filtering, e.g., "all", "booked", etc.
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const token = localStorage.getItem('jwtToken');

  // Function to fetch bookings from the backend.
  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/staff/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching all bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  // Helper to format suite assignment.
  const formatSuiteAssignment = (assignment) => {
    if (!assignment) return 'Not Assigned';
    if (assignment.type === 'redlight') {
      return `RLBS ${assignment.number}`;
    } else if (assignment.type === 'sauna') {
      return assignment.handicap ? `ADA ${assignment.number}` : `SS ${assignment.number}`;
    }
    return 'Not Assigned';
  };

  // Placeholder handler for applying cancellation fee
  const handleApplyCancellationFee = async (bookingId) => {
    try {
      // Replace the following URL and logic with your actual fee processing endpoint.
      const response = await axios.post(
        `http://localhost:5000/api/staff/bookings/${bookingId}/apply-fee`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      fetchBookings();
    } catch (error) {
      console.error('Error applying cancellation fee:', error.response ? error.response.data : error);
      alert(error.response?.data?.message || 'Error applying cancellation fee.');
    }
  };
  // Filter bookings based on the active tab and date range.
  const filterBookingsByDate = (bookingsList) => {
    return bookingsList.filter((booking) => {
      const appt = new Date(booking.appointmentDate);
      // If both filters are set, require appointment date to be in range.
      if (startDateFilter && endDateFilter) {
        return appt >= startDateFilter && appt <= endDateFilter;
      }
      // If only one is set, filter accordingly.
      if (startDateFilter) {
        return appt >= startDateFilter;
      }
      if (endDateFilter) {
        return appt <= endDateFilter;
      }
      return true;
    });
  };

  // Combined filtering: first by activeTab then by date range.
  const filteredBookings =
    activeTab === 'all'
      ? filterBookingsByDate(bookings)
      : filterBookingsByDate(
          bookings.filter(
            (b) => b.status.toLowerCase().trim() === activeTab
          )
        );

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  return (
    <div className="staff-dashboard">
      <h1>Staff Dashboard</h1>

      <div className="dashboard-actions">
        <Link to="/suite-assignments">
          <button className="assignment-btn">View Suite Assignments</button>
        </Link>
      </div>

      {/* Date Range Filter */}
      <div className="date-range-filter">
        <label>
          Start Date:{' '}
          <DatePicker
            selected={startDateFilter}
            onChange={(date) => setStartDateFilter(date)}
            placeholderText="Select start date"
            dateFormat="MMMM d, yyyy"
          />
        </label>
        <label>
          End Date:{' '}
          <DatePicker
            selected={endDateFilter}
            onChange={(date) => setEndDateFilter(date)}
            placeholderText="Select end date"
            dateFormat="MMMM d, yyyy"
          />
        </label>
        <button onClick={fetchBookings}>Reset Filters</button>
      </div>

      {/* Tab Navigation */}
      <div className="tab-buttons">
        {['all', 'booked', 'checked-in', 'in-progress', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <h2>
        {activeTab === 'all'
          ? 'All Sessions'
          : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Sessions`}
      </h2>
      {filteredBookings.length > 0 ? (
        <table className="booking-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Member</th>
              <th>Session Type</th>
              <th>Extras</th>
              <th>Status</th>
              <th>Assigned Suite</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => {
    const appointment = new Date(booking.appointmentDate);
    const dateString = appointment.toLocaleDateString('en-US');
    const timeString = appointment.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const bookingStatus = booking.status.toLowerCase().trim();

    // Determine the status timestamp based on the booking status.
    let statusDatestamp = '';
    let statusTimestamp = '';
    if (bookingStatus === 'booked' && booking.createdAt) {
        statusTimestamp = new Date(booking.createdAt).toLocaleTimeString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } else if (bookingStatus === 'checked-in' && booking.checkedInAt) {
      
      statusTimestamp = new Date(booking.checkedInAt).toLocaleTimeString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } else if (bookingStatus === 'in-progress' && booking.startedAt) {
      
      statusTimestamp = new Date(booking.startedAt).toLocaleTimeString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } else if (bookingStatus === 'completed' && booking.completedAt) {
      
      statusTimestamp = new Date(booking.completedAt).toLocaleTimeString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } else if (bookingStatus === 'cancelled' && booking.cancelledAt) {
      
      statusTimestamp = new Date(booking.cancelledAt).toLocaleTimeString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    };
              return (
                <tr key={booking._id}>
                  <td>{dateString}</td>
                  <td>{timeString}</td>
                  <td>
                    {booking.user && booking.user.username
                      ? booking.user.username
                      : booking.user}
                  </td>
                  <td>
                    {booking.sessionType === 'infrared'
                      ? 'Infrared Sauna Session'
                      : 'Redlight Bed Session'}
                  </td>
                  <td>
                    {booking.sessionType === 'infrared' ? (
                      <>
                        {booking.addGuest && <span>Guest, </span>}
                        {booking.aromatherapy && <span>Aromatherapy, </span>}
                        {booking.halotherapy && <span>Halotherapy</span>}
                      </>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
          {booking.status}<p></p>
          {statusTimestamp && (
            <span className="status-timestamp"> {statusTimestamp}</span>
          )}
        </td>
                  <td>{formatSuiteAssignment(booking.suiteAssignment)}</td>
                  <td>
                    {booking.status.toLowerCase().trim() === 'cancelled' &&
                    booking.cancellationFeeApplied ? (
                      <button
                        className="apply-fee-btn"
                        onClick={() => handleApplyCancellationFee(booking._id)}
                      >
                        Apply Cancellation Fee
                      </button>
                    ) : (
                    booking.status.toLowerCase().trim() !== 'cancelled' && (
                      <Link to={`/staff/edit-booking/${booking._id}`}>
                        <button className="edit-btn">Edit Booking</button>
                      </Link>
                    )
                    )}
                     {booking.status.toLowerCase().trim() !== 'cancelled' && booking.status.toLowerCase().trim() !== 'checked-in' && (
                    <StaffCheckIn
                      bookingId={booking._id}
                      appointmentDate={booking.appointmentDate}
                      refreshBookings={fetchBookings}
                    />
                  )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No bookings available for this tab.</p>
      )}      
    </div>
  );
};

export default StaffDashboard;
