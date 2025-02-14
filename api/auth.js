const serverless = require('serverless-http');
const express = require('express');
const app = express();

app.use(express.json());

// Import your auth router (adjust the path as needed)
const authRoutes = require('../routes/authRoutes');

// Mount the router. Since this file is deployed as /api/auth, the router paths will be relative to that.
app.use('/', authRoutes);

module.exports = serverless(app);
