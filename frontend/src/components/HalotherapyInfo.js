import React from 'react';
import { Link } from 'react-router-dom';
import './HalotherapyInfo.css';

const HalotherapyInfo = () => {
  return (
    <div className="halotherapy-info">
      <div className="content-wrapper">
        <header>
          <h1>Halotherapy: Breathe in Wellness</h1>
          <p>
            Halotherapy, or salt therapy, involves inhaling air with tiny salt particles to improve your breathing and overall well-being.
          </p>
        </header>

        <section>
          <h2>What is Halotherapy?</h2>
          <p>
            Halotherapy is considered an alternative treatment for lung issues such as asthma, bronchitis, and cough. Often performed in spa-like salt rooms, it may also help with skin conditions and allergies.
          </p>
        </section>

        <section>
          <h2>The History of Halotherapy</h2>
          <p>
            Dating back to the 12th century, the practice of visiting salt caves (speleotherapy) for healing was common in Eastern Europe. In the 1800s, Polish salt miners discovered that the salty air kept their lungs healthy and free from infections, leading to the modern practice of halotherapy.
          </p>
        </section>

        <section>
          <h2>Health Benefits of Halotherapy</h2>
          <p>
            Studies suggest halotherapy can help with respiratory conditions, skin problems, and allergies. Salt is naturally:
          </p>
          <ul>
            <li>Mucoactive – clearing mucus from your airways</li>
            <li>Antibacterial – helping prevent infections</li>
            <li>Anti-inflammatory</li>
            <li>Immunity-boosting</li>
            <li>Anti-allergic</li>
          </ul>
          <p>
            It may be used as part of the treatment for lung infections, chronic respiratory conditions (like asthma and bronchitis), and even help improve breathing in COVID-19 recovery.
          </p>
        </section>

        <section>
          <h2>Skin & Anti-Aging Benefits</h2>
          <p>
            Inhaling tiny salt particles may help repair and protect your skin cells, aiding in the treatment of acne, eczema, psoriasis, and even reducing wrinkles.
          </p>
        </section>

        <section>
          <h2>Modern Applications</h2>
          <p>
            Halotherapy is gaining popularity as a complementary treatment for lung issues and skin conditions. Whether you’re looking to relax, boost your immune system, or support recovery from respiratory challenges, halotherapy offers a natural and gentle approach.
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

export default HalotherapyInfo;
