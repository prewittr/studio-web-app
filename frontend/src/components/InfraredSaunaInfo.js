import React from 'react';
import { Link } from 'react-router-dom';
import './InfraredSaunaInfo.css';

const InfraredSaunaInfo = () => {
  return (
    <div className="infrared-info">
      <div className="content-wrapper">
        <header>
          <h1>Infrared Sauna: The Future of Wellness</h1>
          <p>
            Experience deep relaxation, detoxification, and a boost in overall well-being with our state-of-the-art infrared sauna technology.
          </p>
        </header>
        
        <section>
          <h2>What is an Infrared Sauna?</h2>
          <p>
            Unlike traditional saunas that heat the air, infrared saunas use infrared heaters to emit radiant heat that is directly absorbed by your body. This results in a more efficient and comfortable way to induce sweating and promote healing.
          </p>
        </section>
        
        <section>
          <h2>Benefits of Infrared Sauna Therapy</h2>
          <ul>
            <li>Stress reduction and relaxation</li>
            <li>Improved sleep quality</li>
            <li>Muscle relaxation and pain relief</li>
            <li>Detoxification through sweating</li>
            <li>Enhanced circulation and cardiovascular support</li>
            <li>Potential support for weight loss</li>
            <li>Improved skin tone and appearance</li>
            <li>Accelerated athletic recovery</li>
            <li>Reduced inflammation</li>
            <li>Assistance in managing menopause symptoms</li>
          </ul>
        </section>
        
        <section>
          <h2>How Infrared Saunas Work</h2>
          <p>
            Infrared technology uses light waves to penetrate deep into the skin, warming your body directly and increasing your core temperature at a lower ambient temperature. This direct warming promotes deep sweating, improved circulation, and a natural detoxification process.
          </p>
        </section>
        
        <section>
          <h2>Why Choose Infrared?</h2>
          <p>
            Our infrared saunas are designed for comfort and efficiency. Enjoy longer sessions at a lower temperature with customizable settings that fit your wellness needs. Whether you're looking to relieve stress, boost athletic recovery, or simply unwind, infrared sauna therapy offers a modern, luxurious approach to well-being.
          </p>
        </section>
        
        <footer>
          <p>&copy; {new Date().getFullYear()} Diviti Adora, LLC. All rights reserved.</p>
          <p>
            <Link to="/">Back to Home</Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default InfraredSaunaInfo;
