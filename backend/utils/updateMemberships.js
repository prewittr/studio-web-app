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
  updateMemberships(); // Only call your function after connection is established
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});


const priceIdToMembershipTypeMap = {
    'price_1Qv3tnRxXwnAJ8WE0zgQ2eeY': 'Infinite Heat',
    'price_1Qv3u1RxXwnAJ8WEAsxO7fpV': 'Balanced Heat',
    'price_1Qv3uCRxXwnAJ8WEareO6gC1': 'Ember Heat',
    'price_1NugUhRxXwnAJ8WEY3jXbpxq': 'Radiant Glow',
    'price_1NugUsRxXwnAJ8WEEd2pCD2vU': 'VIP',
  //... add other mappings for your price IDs
};

const stripeStatusToMembershipStatusMap = {
  'active': 'Active',
  'trialing': 'Trialing',
  'past_due': 'Past Due',
  'canceled': 'Canceled',
  'unpaid': 'Unpaid',
  //... add other mappings for Stripe subscription statuses
};

const updateMemberships = async () => {
  try {
    const users = await User.find({}); // Fetch all users

    for (const user of users) {
      if (user.stripeCustomerId) {
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
          status: 'all',
        });
           console.log(`Stripe subscriptions for user ${user._id}:`, JSON.stringify(subscriptions, null, 2));

        let membershipType = 'none'; // Default to 'none'
          let membershipStatus = 'None'; // Default to 'None'
          
          if (subscriptions.data.length > 0) {
              const latestSubscription = subscriptions.data[0];
              const priceId = latestSubscription.plan.id;

          // Translate membership type
          membershipType = priceIdToMembershipTypeMap[priceId] || 'none';

          // Translate membership status
          membershipStatus = stripeStatusToMembershipStatusMap[latestSubscription.status] || 'None';
        }

        await User.findByIdAndUpdate(user._id, { membershipType, membershipStatus });
      }
    }

    console.log('Membership data updated successfully!');
  } catch (error) {
    console.error('Error updating membership data:', error);
  }
};

updateMemberships();