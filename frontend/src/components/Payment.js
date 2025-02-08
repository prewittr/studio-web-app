import React, { useState } from 'react';
import axios from 'axios';

function Payment() {
  const [clientSecret, setClientSecret] = useState('');
  const [amount, setAmount] = useState(1000); // amount in cents
  const [message, setMessage] = useState('');

  // Retrieve token from local storage
  const token = localStorage.getItem('jwtToken');

  const handleCreatePaymentIntent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/payments/create-intent',
        { amount, currency: 'usd', description: 'Booking payment' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClientSecret(response.data.clientSecret);
      setMessage('Payment intent created successfully!');
    } catch (err) {
      console.error('Payment error:', err);
      setMessage('Error creating payment intent.');
    }
  };

  return (
    <div>
      <h2>Payment</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleCreatePaymentIntent}>
        <div>
          <label>Amount (in cents):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit">Create Payment Intent</button>
      </form>
      {clientSecret && (
        <div>
          <h3>Client Secret:</h3>
          <p>{clientSecret}</p>
          {/* In a real app, you'd now use Stripe.js with this clientSecret */}
        </div>
      )}
    </div>
  );
}

export default Payment;
