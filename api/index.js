const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware: parse JSON bodies with increased limit, and URL-encoded bodies.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Use CORS so that your API can be accessed from your frontend.
app.use(cors());


// Import and mount routes from backend/routes/index.js
const backendRoutes = require('../backend/routes'); // Adjust the path if needed
app.use('/api/v1', backendRoutes);

// Serve static assets from the frontend build directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));

  // Redirect all unmatched routes to the React app's index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
  });
}

// Mount routes from the backend folder
const authRoutes = require('../backend/routes/authRoutes');
app.use('/api/auth', authRoutes);

const protectedRoutes = require('../backend/routes/protectedRoutes');
app.use('/api/protected', protectedRoutes);

const bookingRoutes = require('../backend/routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);

const paymentRoutes = require('../backend/routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);

const contactRoutes = require('../backend/routes/contactRoutes');
app.use('/api/contact', contactRoutes);

const membersRoutes = require('../backend/routes/membersRoutes');
app.use('/api/members', membersRoutes);

const sessionsRoutes = require('../backend/routes/sessionsRoutes');
app.use('/api/sessions', sessionsRoutes);

const staffRoutes = require('../backend/routes/staffRoutes');
app.use('/api/staff', staffRoutes);

const profileRoutes = require('../backend/routes/profileRoutes');
app.use('/api/profile', profileRoutes);

const assignmentsRoutes = require('../backend/routes/assignmentsRoutes');
app.use('/api/assignments', assignmentsRoutes);

const uploadRoutes = require('../backend/routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);


// Default route
app.get('/', (req, res) => {
  res.send('Welcome to Diviti Adora Studio Web App Backend!');
});

module.exports = serverless(app);
