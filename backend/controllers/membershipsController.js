// backend/controllers/membershipController.js
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.purchaseMembership = async (req, res) => {
  try {
    const { membershipType, paymentMethodId } = req.body;
    // Validate the membershipType against your allowed types
    const allowedTypes = ['infinite_heat', 'balanced_heat', 'ember_heat', 'radiant_glow', 'vip'];
    if (!allowedTypes.includes(membershipType)) {
      return res.status(400).json({ message: 'Invalid membership type selected.' });
    }
    
    // Determine pricing based on membershipType.
    // You might have a pricing table (in cents) defined elsewhere.
    const pricing = {
      infinite_heat: 5000,   // $50.00
      balanced_heat: 3000,   // $30.00
      ember_heat: 2000,      // $20.00
      radiant_glow: 4000,    // $40.00
      vip: 8000              // $80.00
    };
    const amount = pricing[membershipType];
    if (!amount) {
      return res.status(400).json({ message: 'Pricing for membership not found.' });
    }

    // Process payment via Stripe (example using Payment Intents)
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true
    });

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment failed. Please try again.' });
    }

    // Payment succeeded, update the user's membership
    // Assume req.user is available from authentication middleware.
    const userId = req.user.id;
    // For example, membership lasts for one month from purchase.
    const membershipExpiresAt = new Date();
    membershipExpiresAt.setMonth(membershipExpiresAt.getMonth() + 1);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        membershipType,
        membershipPaid: true,
        membershipExpiresAt
      },
      { new: true }
    );

    res.json({
      message: 'Membership purchased successfully!',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error purchasing membership:', error);
    res.status(500).json({ message: 'Server error while processing membership purchase.' });
  }
};
