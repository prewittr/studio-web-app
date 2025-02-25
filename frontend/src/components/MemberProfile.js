import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { jwtDecode } from 'jwt-decode';
import './MemberProfile.css';

const MemberProfile = () => {
  const navigate = useNavigate(); // Define navigate
  const token = localStorage.getItem('jwtToken'); 
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    preferredName: '',
    contactNumber: '',      
    membershipType: '',     
    membershipStatus: '',   // (read-only maybe)
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    birthday: '',
    profilePicture: ''
  });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch the current profile data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = response.data;
        setProfile({
          membershipType: data.membershipType || 'None',
          membershipStatus: data.membershipStatus || 'None',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          preferredName: data.preferredName || '',
          contactNumber: data.contactNumber || '',
          //membershipType: data.membershipType || '',
          //membershipStatus: data.membershipStatus || 'Active',
          street: data.address?.street || '',
          city: data.address?.city || '',
          state: data.address?.state || '',
          zip: data.address?.zip || '',
          country: data.address?.country || '',
          birthday: data.birthday ? data.birthday.split('T')[0] : '',
          profilePicture: data.profilePicture || ''
        });
        setProfilePicPreview(data.profilePicture || '');
      } catch (err) {
        console.error(err);
        setError('Failed to load profile.');
      }
    };

    fetchProfile();
  }, [token]);

  // Update form fields on change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle profile picture file selection
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePicFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // On form submission, update the profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('jwtToken');
      let updatedProfile = { ...profile };

      // If a new profile picture is selected, upload it first.
      if (profilePicFile) {
        const formData = new FormData();
        formData.append('file', profilePicFile);
        const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        // Set the returned URL as the new profile picture
        updatedProfile.profilePicture = uploadResponse.data.url;
      }

      const response = await axios.put('http://localhost:5000/api/profile', updatedProfile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message || 'Profile updated successfully!');
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handleOpenPortal = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
    if (!token) {
      // Handle the case where the user is not logged in
      alert('Please log in to access the customer portal.');
      navigate('/login?redirect=/profile'); // Redirect to login, then back to profile
      return;
    }

    // Decode the JWT to get the user ID
    const decodedToken = jwtDecode(token); // Make sure to install jwt-decode: npm install jwt-decode
   // const userId = decodedToken.id; // Assuming your JWT has a "id" field with the user ID

    const response = await axios.post('http://localhost:5000/api/stripe/create-portal-session', { userId: decodedToken.id }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
      // Access the portal URL directly from response.data
    window.location.href = response.data.url; // Redirect to the portal URL  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server Error:", response.status, errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const { url } = await response.json();
      window.location.href = url; // Redirect to the portal URL
    } catch (error) {
      console.error('Error opening portal:', error);
    }
  };

  return (
    <div className="member-profile">
      <h2>My Profile</h2>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <form onSubmit={handleSubmit} className="profile-form">
        {/* Profile Picture Section */}
        <div className="profile-pic-section">
          <label htmlFor="profilePicture">Profile Picture</label>
          <input 
            type="file" 
            id="profilePicture" 
            name="file"  // Must be named "file"
            accept="image/*"
            onChange={handleProfilePicChange}
          />
          {profilePicPreview && (
            <div className="profile-pic-preview">
              <img src={profilePicPreview} alt="Profile Preview" />
            </div>
          )}
        </div>
        {/* Personal Info */}
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input 
            type="text"
            id="firstName"
            name="firstName"
            value={profile.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input 
            type="text"
            id="lastName"
            name="lastName"
            value={profile.lastName}
            onChange={handleChange}
            required
          />
        </div>
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
        {/* New: Contact Number */}
        <div className="form-group">
          <label htmlFor="contactNumber">Contact Number</label>
          <input 
            type="tel"
            id="contactNumber"
            name="contactNumber"
            value={profile.contactNumber}
            onChange={handleChange}
          />
        </div>
        {/* New: Membership Type */}
        <div className="form-group">
          <label htmlFor="membershipType">Membership Type</label>
          <input 
            type="text"
            id="membershipType"
            name="membershipType"
            value={profile.membershipType}
            onChange={handleChange}
          />
        </div>
        {/* Membership Status is usually read-only */}
        <div className="form-group">
          <label htmlFor="membershipStatus">Membership Status</label>
          <input 
            type="text"
            id="membershipStatus"
            name="membershipStatus"
            value={profile.membershipStatus}
            readOnly
          />
        </div>
        {/* Address Fieldset */}
        <fieldset className="address-fieldset">
          <legend>Address</legend>
          <div className="form-group">
            <label htmlFor="street">Street</label>
            <input 
              type="text"
              id="street"
              name="street"
              value={profile.street}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input 
              type="text"
              id="city"
              name="city"
              value={profile.city}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input 
              type="text"
              id="state"
              name="state"
              value={profile.state}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="zip">Zip Code</label>
            <input 
              type="text"
              id="zip"
              name="zip"
              value={profile.zip}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input 
              type="text"
              id="country"
              name="country"
              value={profile.country}
              onChange={handleChange}
            />
          </div>
        </fieldset>
        {/* Birthday */}
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
        <button type="submit" className="save-btn">Save Profile</button>
        <button onClick={handleOpenPortal}>Manage Billing</button>
      </form>
    </div>
  );
};


export default MemberProfile;
