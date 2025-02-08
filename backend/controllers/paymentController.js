const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a payment intent for a transaction
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, description } = req.body;

    // Validate input (amount should be provided in the smallest currency unit, e.g., cents for USD)
    if (!amount || !currency) {
      return res.status(400).json({ message: 'Amount and currency are required.' });
    }

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,         // e.g., 1000 for $10.00 if currency is USD
      currency,       // e.g., 'usd'
      description,    // Optional: description of the transaction
      payment_method_types: ['card']  // Specify the payment method type(s)
    });

    // Respond with the client secret to complete the payment on the frontend
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
};
