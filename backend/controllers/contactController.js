const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Save the contact inquiry to the database
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    console.log('New contact inquiry saved:', newContact);

    // Log the inquiry (for debugging or record keeping)
    console.log('New contact inquiry:', { name, email, message });

    // Create a Nodemailer transporter using SMTP credentials from your environment
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email options to alert the team
    const mailOptions = {
      from: email, // You might want to use a no-reply address instead
      to: process.env.TEAM_EMAIL,
      subject: 'New Contact Inquiry from Diviti Adora Infrared Sauna Studio Web App',
      text: `You have received a new contact inquiry:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    // Send the email (this is asynchronous; errors here are logged but do not block the response)
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending contact email:', error);
      } else {
        console.log('Contact email sent:', info.response);
      }
    });

    res.status(200).json({ message: 'Your inquiry has been received. We will get back to you shortly.' });
  } catch (error) {
    console.error('Error handling contact form:', error);
    res.status(500).json({ message: 'Server error while submitting contact form.' });
  }
};
