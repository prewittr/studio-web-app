import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MemberProfile.css';

const MemberProfile = () => {
  const [profile, setProfile] = useState({
    preferredName: '',
    address: '',
    birthday: '',
    paymentMethod: '', // This can be a placeholder string or a token ID, etc.
    // You can add other preference fields here
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch the current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Assuming the API returns a user object with these fields
        setProfile({
          preferredName: response.data.preferredName || '',
          address: response.data.address || '',
          birthday: response.data.birthday ? response.data.birthday.split('T')[0] : '',
          paymentMethod: response.data.paymentMethod || ''
          // add other fields as needed
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load profile.');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.put('http://localhost:5000/api/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message || 'Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="member-profile">
      <h2>My Profile</h2>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="preferredName">Preferred Name</label>
          <input
            type="text"
            id="preferredName"
            name="preferredName"
            value={profile.preferredName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={profile.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="birthday">Birthdate</label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            value={profile.birthday}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="paymentMethod">Saved Payment Method</label>
          <input
            type="text"
            id="paymentMethod"
            name="paymentMethod"
            value={profile.paymentMethod}
            onChange={handleChange}
            placeholder="e.g., Card ending in 1234"
          />
        </div>
        {/* Add more fields for other preferences if needed */}
        <button type="submit" className="save-btn">Save Profile</button>
      </form>
    </div>
  );
};

export default MemberProfile;
