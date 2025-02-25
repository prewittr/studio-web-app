import React, { useState } from 'react';
//import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage('');
    setError('');
    try {
      // Post the contact data to your API endpoint (adjust URL as needed)
      // await axios.post('${process.env.REACT_APP_API_BASE_URL}/contact', formData);
      // For now, we'll simulate a successful submission:
      setResponseMessage("Thank you for contacting us! We'll get back to you soon.");
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (err) {
      setError('Error submitting form. Please try again later.');
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-form-container">
        <h2>Contact Us</h2>
        <p>Please fill out the form below to send us your inquiry. Promise we won't spam you!</p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number:</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea 
              id="message" 
              name="message" 
              rows="5" 
              value={formData.message} 
              onChange={handleChange} 
              required
            ></textarea>
          </div>
          <button type="submit">Submit</button>
        </form>
        {responseMessage && <p className="success-message">{responseMessage}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="contact-map">
        <h3>Diviti Adora Infrared and Red Light Studio Location</h3>
        <iframe
          title="Studio Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2831.9092613691455!2d-110.94321418485079!3d32.42647964806032!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86d60dc96fcfedf3%3A0xf8271d485c1bd5bd!2s1930%20E%20Tangerine%20Rd%20%23100%2C%20Oro%20Valley%2C%20AZ%2085737!5e0!3m2!1sen!2sus!4v1739725053829!5m2!1sen!2sus"
          width= "600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen="true"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
