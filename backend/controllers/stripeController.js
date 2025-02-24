// stripeController.js
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16; custom_checkout_beta=v1;',
});

const createCheckoutSession = async (req, res) => {
  try {
    const { cartItems } = req.body;
    if (!cartItems ||!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }
    console.log("DEBUG:::cartItems:", cartItems);

    // 1. Determine the `mode` based on `cartItems`
    const hasSubscription = cartItems.some(item => item.type === 'membership');
    const hasOneTimePurchase = cartItems.some(item => item.type === 'package');

    let mode = 'payment'; // Default to 'payment'
    if (hasSubscription && hasOneTimePurchase) {
      // If there are both one-time and subscription items, handle this case
      return res.status(400).json({ error: 'Cannot mix one-time and subscription items in the same cart.' });
    } else if (hasSubscription) {
      mode = 'subscription';
    }

    // 2. Construct `line_items`
    const lineItems = cartItems.map(item => ({
      price: item.priceId,
      quantity: item.quantity || 1,
    }));
    

    // 3. Retrieve `customerId` from `req.user`
    if (!req.user ||!req.user.stripeCustomerId) {
      return res.status(401).json({
        error: 'Unauthorized: Missing Stripe customer ID.'
      });
    }
    const customerId = req.user.stripeCustomerId;

    // 4. Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: mode,
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.json({ sessionId: session.id }); // Return sessionId in the response
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      error: 'An error occurred while creating the checkout session.'
    });
  }
};

const createPortalSession = async (req, res) => {
  try {
    const { userId } = req.body; // Get the user ID from the request body
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }
    
    // Fetch the user from the database to get the stripeCustomerId
    const user = await User.findById(userId);
    if (!user || !user.stripeCustomerId) {
      return res.status(404).json({ error: 'User not found or does not have a Stripe customer ID.' });
    }
    console.log("DEBUG::Stripe Customer ID:", user.stripeCustomerId);
    
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${req.headers.origin}/member`, // Redirect back to the member's dashboard after portal session
    });
    
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: 'An error occurred while creating the portal session.' });
  }
};

module.exports = { createCheckoutSession, createPortalSession };
