// For sending emails, you could use a package like nodemailer.
// Here, we'll simply log the contact data for demonstration.

exports.submitContactForm = async (req, res) => {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      // For now, log the inquiry (later you could send an email or save it to a database)
      console.log('New contact inquiry:', { name, email, message });
  
      res.status(200).json({ message: 'Your inquiry has been received. We will get back to you shortly.' });
    } catch (error) {
      console.error('Error handling contact form:', error);
      res.status(500).json({ message: 'Server error while submitting contact form.' });
    }
  };
  