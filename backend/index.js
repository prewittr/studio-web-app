// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Increase the request body size limit
app.use(express.json({ limit: '10mb' }));  // custom limit
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Connect to the database
connectDB();

// Use CORS middleware
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

// Member Routes
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

// Upload Routes (Profile Pics)
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);

// Suite routes
const suitesRoutes = require('./routes/suitesRoutes');
app.use('/api/suites', suitesRoutes);

// Memberships Routes
const membershipRoutes = require('./routes/membershipsRoutes');
app.use('/api/memberships', membershipRoutes);

// Stripe Routes
const stripeRoutes = require('./routes/stripeRoutes');
app.use('/api/stripe', stripeRoutes); // Mount the Stripe routes under /api/stripe


// Sample route
app.get('/', (req, res) => { 
    res.send('Welcome to Diviti Adora Studio Web App Backend!');
});
  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
