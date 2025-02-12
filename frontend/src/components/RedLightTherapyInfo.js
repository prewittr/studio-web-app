import React from 'react';
import { Link } from 'react-router-dom';
import './RedLightTherapyInfo.css';

const RedLightTherapyInfo = () => {
  return (
    <div className="redlight-info">
      <div className="content-wrapper">
        <header>
          <h1>Red Light Therapy: Revitalize Your Health</h1>
          <p>
            Discover the transformative power of red and near-infrared light. From rejuvenating your skin to enhancing muscle recovery, red light therapy is at the forefront of holistic wellness.
          </p>
        </header>

        <section>
          <h2>What is Red Light Therapy?</h2>
          <p>
            Red and near-infrared light are part of the electromagnetic spectrum and are naturally emitted by the sun. These bioactive wavelengths (600–700nm for red and 700–1100nm for near‑infrared) can stimulate collagen production, smooth fine lines, and rejuvenate the appearance of skin and hair. Near‑infrared light penetrates deeper into tissues to assist with wound healing, muscle recovery, nerve injury, and joint pain.
          </p>
        </section>

        <section>
          <h2>The History</h2>
          <p>
            Initially explored by NASA for plant growth and wound healing in space, red light therapy has evolved into a widely accepted treatment in photodynamic therapy. Originally used to activate photosensitizer drugs for treating skin conditions, its potential continues to expand.
          </p>
        </section>

        <section>
          <h2>How Does It Work?</h2>
          <p>
            Red light therapy is believed to work by stimulating the mitochondria—the "power plants" of your cells. This boost in energy allows cells to function more efficiently, repair skin, promote new cell growth, and rejuvenate overall skin appearance. The treatment can:
          </p>
          <ul>
            <li>Stimulate collagen production for stronger, more elastic skin</li>
            <li>Increase fibroblast production, which builds connective tissue</li>
            <li>Enhance blood circulation</li>
            <li>Reduce cellular inflammation</li>
          </ul>
        </section>

        <section>
          <h2>Benefits of Red Light Therapy</h2>
          <ul>
            <li>Reduces wrinkles, fine lines, and age spots</li>
            <li>Promotes wound healing and tissue repair</li>
            <li>Improves facial texture</li>
            <li>Encourages hair growth</li>
            <li>Boosts melatonin levels for better sleep</li>
            <li>Enhances muscle recovery and energy levels</li>
            <li>Improves joint health</li>
            <li>Reduces pain, swelling, and inflammation</li>
            <li>Helps improve conditions such as psoriasis, eczema, and rosacea</li>
          </ul>
        </section>

        <section>
          <h2>Evolution of Interest</h2>
          <p>
            NASA's initial experiments with red light for plant growth and wound healing in space paved the way for its adoption in medical treatments on Earth. Today, red light therapy is recognized in photodynamic therapy and is being explored for a variety of other health conditions.
          </p>
        </section>

        <section>
          <h2>Modern Applications</h2>
          <p>
            Red light therapy is emerging as a promising treatment for skin rejuvenation, pain relief, and overall wellness. Whether you're looking to combat the signs of aging or accelerate recovery after exercise, ask your healthcare provider if red light therapy could be right for you.
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

export default RedLightTherapyInfo;
