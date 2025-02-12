// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());


// Import auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Import and use protected routes
const protectedRoutes = require('./routes/protectedRoutes');
app.use('/api/protected', protectedRoutes);

// Booking routes (THIS IS DEAD)
const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);

// Payment routes (Stripe)
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);

// Contact Routes
const contactRoutes = require('./routes/contactRoutes');
app.use('/api/contact', contactRoutes);

//Member Routes
const membersRoutes = require('./routes/membersRoutes');
app.use('/api/members', membersRoutes);

// Session Booking Routes
const sessionsRoutes = require('./routes/sessionsRoutes');
app.use('/api/sessions', sessionsRoutes);

// Staff routes
const staffRoutes = require('./routes/staffRoutes');
app.use('/api/staff', staffRoutes);

// Profile Routes
const profileRoutes = require('./routes/profileRoutes');
app.use('/api/profile', profileRoutes);

// Suite Assignment Router
const assignmentsRoutes = require('./routes/assignmentsRoutes');
app.use('/api/assignments', assignmentsRoutes);



// Sample route
app.get('/', (req, res) => { 
    res.send('Welcome to Diviti Adora Studio Web App Backend!');
  });
  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
