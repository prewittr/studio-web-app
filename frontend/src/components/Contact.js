import React, { useState } from 'react';
import axios from 'axios';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assuming your backend is running on localhost:5000
      const res = await axios.post('http://localhost:5000/api/contact', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      setResponseMessage(res.data.message);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      setResponseMessage('There was an error submitting your inquiry.');
    }
  };

  return (
    <div>
      <h2>Contact Us</h2>
      
      {/* Google Maps Embed Example */}
      <div style={{ width: '100%', height: '400px', marginBottom: '20px' }}>
        <iframe
          title="Studio Location"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          // Replace the src below with your actual Google Maps embed link.
          src="https://www.google.com/maps/embed/v1/place?q=Your+Studio+Address&key=AIzaSyBJqofS7Tz2qhO2lxaVorx7-WxxCkwGLGw"
          allowFullScreen
        ></iframe>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            required 
          />
        </div>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>
        <div>
          <label>Message:</label>
          <textarea 
            name="message" 
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit">Submit Inquiry</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

export default Contact;
