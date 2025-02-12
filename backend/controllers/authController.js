const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    // Extract only the fields we need from the request body.
    const { username, password, firstName, lastName, email } = req.body;
    
    // Check that required fields are provided.
    if (!username || !password || !firstName || !lastName || !email) {
      return res.status(400).json({ message: 'Username, password, first name, last name, and email are required.' });
    }

    // Check if the username or email already exists.
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already taken.' });
    }

    // Hash the password.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user, defaulting role to "member".
    const user = new User({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      role: 'member'
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// User Login
exports.login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find the user
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
  
      // Create JWT including username
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ token, message: 'Login successful.' });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login.' });
    }
  };
  
