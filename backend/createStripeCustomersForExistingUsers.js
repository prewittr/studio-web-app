require('dotenv').config(); // Load environment variables from.env
const User = require('./models/User');
//... rest of your code...const User = require('./models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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