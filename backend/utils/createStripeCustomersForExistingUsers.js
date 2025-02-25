require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
console.log('Stripe API Key:', process.env.STRIPE_SECRET_KEY);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Require Stripe

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  createStripeCustomersForExistingUsers(); // Only call your function after connection is established
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const createStripeCustomersForExistingUsers = async () => {    
  try {
    
    const users = await User.find({ stripeCustomerId: { $exists: false } }).maxTimeMS(30000); // Set a 30-second timeout

    for (const user of users) {
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
      });

      user.stripeCustomerId = stripeCustomer.id;
      await user.save();
      console.log(`Created Stripe customer for user ${user.username}`);
    }

    console.log('Finished creating Stripe customers for existing users.');
  } catch (error) {
    console.error('Error creating Stripe customers:', error);
  }
};

createStripeCustomersForExistingUsers();