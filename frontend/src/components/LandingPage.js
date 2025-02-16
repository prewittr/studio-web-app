import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = ({ token }) => {
  // Decide the target route based on whether the user is logged in.
  const getStartedRoute = token ? '/member' : '/login';

  return (
    <div>
      <section className="landing-page">
        <video autoPlay loop muted className="background-video">
          <source src={`${process.env.PUBLIC_URL}/videos/DASS100.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="overlay">
          <h1>Welcome to Diviti Adora Infrared Sauna & Redlight Studio Web App</h1>
          <p>Your complete solution for managing bookings, payments, and more.</p>
          <Link to={getStartedRoute}>
            <button className="cta-btn">Get Started</button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <h2>Our Services</h2>
        <div className="feature-container">
          <div className="feature-card">
            <a href="/infrared-info" className="feature-link">
              <img
                src={`${process.env.PUBLIC_URL}/images/sauna3.jpg`}
                alt="Infrared Sauna"
                className="feature-image"
              />
              <h3>Infrared Sauna</h3>
              <p>Sauna that uses infrared radiation to heat the body directly, rather than heating the air around it.</p>
            </a>
          </div>
          <div className="feature-card">
            <a href="/chromotherapy-info" className="feature-link">
              <img
                src={`${process.env.PUBLIC_URL}/images/chromotherapy1.png`}
                alt="Chromotherapy"
                className="feature-image"
              />
              <h3>Chromotherapy</h3>
              <p>The use of colors to promote well-being.</p>
            </a>
          </div>
          <div className="feature-card">
            <a href="/halotherapy-info" className="feature-link">
              <img
                src={`${process.env.PUBLIC_URL}/images/halo1.jpg`}
                alt="Halo Salt Therapy"
                className="feature-image"
              />
              <h3>Halo Salt Therapy</h3>
              <p>An add-on treatment that involves breathing in salt particles to improve breathing and other conditions.</p>
            </a>
          </div>
          <div className="feature-card">
            <a href="/redlight-info" className="feature-link">
              <img
                src={`${process.env.PUBLIC_URL}/images/RedBed2.jpg`}
                alt="Red Light Therapy"
                className="feature-image"
              />
              <h3>Red Light Therapy</h3>
              <p>The use of low levels of red light to stimulate cell regeneration and blood flow.</p>
            </a>
          </div>    
        </div>
      </section>

      {/* Memberships Section */}
      <section className="memberships">
        <h2>Memberships Offered</h2>
        <div className="membership-cards">
          <Link to="/memberships#infinite-heat" className="membership-link">
            <div className="membership-card">
              <h3>Infinite Heat Membership</h3>
              <p>Unlimited Infrared Sauna Sessions</p>
            </div>
          </Link>
          <Link to="/memberships#balanced-heat" className="membership-link">
            <div className="membership-card">
              <h3>Balanced Heat Membership</h3>
              <p>8 Infrared Sauna Sessions per month</p>
            </div>
          </Link>
          <Link to="/memberships#ember-heat" className="membership-link">
            <div className="membership-card">
              <h3>Ember Heat Membership</h3>
              <p>4 Infrared Sauna Sessions per month</p>
            </div>
          </Link>
          <Link to="/memberships#radiant-glow" className="membership-link">
            <div className="membership-card">
              <h3>Radiant Glow Membership</h3>
              <p>Unlimited Red Light Bed Sessions</p>
            </div>
          </Link>
          <Link to="/memberships#vip" className="membership-link">
            <div className="membership-card">
              <h3>V.I.P.</h3>
              <p>Unlimited Infrared and Red Light Bed Sessions</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta">
        <h2>Ready to get started?</h2>
        <Link to={getStartedRoute}>
          <button className="cta-btn">Sign Up Today</button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <p>&copy; {new Date().getFullYear()} Diviti Adora, LLC. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
