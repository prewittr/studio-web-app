// stripeController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-16; custom_checkout_beta=v1;',
});

const createCheckoutSession = async (req, res) => {
  try {
    const { priceId } = req.body; // Get the priceId from the request body

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId, // Use the priceId directly
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/success`, 
      cancel_url: `${req.headers.origin}/cancel`, 
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createCheckoutSession };