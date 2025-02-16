import React from 'react';
import './MembershipOptions.css';

const MembershipOptions = () => {
  return (
    <div className="membership-options">
      <header className="membership-header">
        <h1>Membership Options</h1>
        <p>Choose the perfect membership to match your wellness goals.</p>
      </header>
      <div className="membership-cards">
        <div id="infinite-heat" className="membership-card">
          <h2>Infinite Heat Membership</h2>
          <p>Unlimited Infrared Sauna Sessions</p>
          <p>Enjoy complete freedom with unlimited access to our state-of-the-art infrared saunas.</p>
        </div>
        <div id="balanced-heat" className="membership-card">
          <h2>Balanced Heat Membership</h2>
          <p>8 Infrared Sauna Sessions per month</p>
          <p>Experience the perfect balance of relaxation and renewal with eight sessions per month.</p>
        </div>
        <div id="ember-heat" className="membership-card">
          <h2>Ember Heat Membership</h2>
          <p>4 Infrared Sauna Sessions per month</p>
          <p>Ideal for those seeking occasional relaxation and rejuvenation.</p>
        </div>
        <div id="radiant-glow" className="membership-card">
          <h2>Radiant Glow Membership</h2>
          <p>Unlimited Red Light Bed Sessions</p>
          <p>Revitalize your skin and body with unlimited access to our red light therapy beds.</p>
        </div>
        <div id="vip" className="membership-card">
          <h2>V.I.P.</h2>
          <p>Unlimited Infrared and Red Light Bed Sessions</p>
          <p>For the ultimate wellness experience, enjoy unlimited access to both infrared and red light therapies.</p>
        </div>
      </div>
    </div>
  );
};

export default MembershipOptions;
