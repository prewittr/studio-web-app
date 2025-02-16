import React from 'react';
import { Link } from 'react-router-dom';
import './ChromotherapyInfo.css';

const ChromotherapyInfo = () => {
  return (
    <div className="chromotherapy-info">
      <div className="content-wrapper">
        <header>
          <h1>Chromotherapy: Healing with Color</h1>
          <p>
            Chromotherapy, also known as color therapy, uses color and light to treat various mental and physical conditions.
            Its origins can be traced back to the ancient Egyptians.
          </p>
        </header>

        <section>
          <h2>How Chromotherapy Supports Your Health</h2>
          <p>
            Diviti Adora integrates chromotherapy with our infrared sauna, and red light therapy equipment
            to enhance your journey to optimal living. Discover the benefits:
          </p>
          <ul>
            <li>Reduced swelling and decreased inflammation</li>
            <li>Pain relief</li>
            <li>Accelerated healing</li>
            <li>Increased range of motion</li>
            <li>Decreased muscle tension</li>
            <li>Improved circulation</li>
            <li>Regulated mood</li>
            <li>Improved sleeping patterns</li>
            <li>Relief of SAD</li>
            <li>Anti-aging benefits</li>
          </ul>
        </section>

        <section>
          <h2>Types of Color Therapy</h2>
          <p>Different colors can impact the body in various ways:</p>
          <ul>
            <li><strong>Red:</strong> Energizes and invigorates.</li>
            <li><strong>Blue:</strong> Calms and relieves pain.</li>
            <li><strong>Green:</strong> Relieves stress and promotes relaxation.</li>
            <li><strong>Yellow:</strong> Boosts mood and optimism.</li>
            <li><strong>Orange:</strong> Stimulates appetite and mental activity.</li>
          </ul>
        </section>

        <section>
          <h2>Techniques of Color Therapy</h2>
          <p>
            Color therapy is applied either by focusing on a particular color or by directly reflecting specific colors onto the body.
            Each color has its own wavelength and frequency, producing either stimulating or calming effects.
          </p>
        </section>

        <section>
          <h2>What Chromotherapy Can Help With</h2>
          <ul>
            <li>Stress</li>
            <li>Depression</li>
            <li>Aggression</li>
            <li>High blood pressure</li>
            <li>Sleep disorders</li>
            <li>Anxiety</li>
            <li>Certain cancers</li>
            <li>Skin infections</li>
          </ul>
          <p>
            While the scientific evidence is still emerging, chromotherapy is a popular complementary treatment.
          </p>
        </section>

        <section>
          <h2>Benefits of Color Therapy</h2>
          <ul>
            <li><strong>Stress relief:</strong> Soothing colors like blue and green calm the mind.</li>
            <li><strong>Appetite boost:</strong> Warm colors may increase hunger.</li>
            <li><strong>SAD relief:</strong> Bright, warm hues might alleviate seasonal affective disorder.</li>
            <li><strong>Energy boost:</strong> Vibrant colors like red and yellow can enhance energy.</li>
          </ul>
        </section>

        <section>
          <h2>Origin of Chromotherapy</h2>
          <p>
            With roots in ancient Egyptian, Greek, Chinese, and Indian practices, chromotherapy has been used for thousands of years.
            The Egyptians, for instance, built temples with colored crystals to refract sunlight into healing patterns.
          </p>
        </section>

        <section>
          <h2>Modern Integration</h2>
          <p>
            Today, chromotherapy is increasingly integrated with treatments like infrared saunas, offering a holistic approach to wellness.
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

export default ChromotherapyInfo;
